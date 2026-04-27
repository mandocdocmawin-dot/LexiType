<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypingSession;
use App\Models\keystrokeMistake;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class TypingSessionController extends Controller
{
    /**
     * Store a typing session and optional keystroke mistakes from the client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'wpm_score' => 'required|integer',
            'accuracy_percentage' => 'required|integer',
            'duration_seconds' => 'required|integer',
            'difficulty_played' => 'required|string',
            'mistakes' => 'nullable|array',
            'mistakes.*.expected_character' => 'required_with:mistakes|string',
            'mistakes.*.typed_char' => 'required_with:mistakes|string',
            'mistakes.*.time_to_press_ms' => 'required_with:mistakes',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $typingSession = TypingSession::create([
            'user_id' => $user->id,
            'wpm_score' => $validated['wpm_score'],
            'accuracy_percentage' => $validated['accuracy_percentage'],
            'duration_seconds' => $validated['duration_seconds'],
            'difficulty_played' => $validated['difficulty_played'],
        ]);

        // Save keystroke mistakes if provided
        if (!empty($validated['mistakes']) && is_array($validated['mistakes'])) {
            foreach ($validated['mistakes'] as $m) {
                // Normalize fields to strings to match migration types
                $typingSession->keystrokeMistakes()->create([
                    'expected_character' => (string) ($m['expected_character'] ?? ''),
                    'typed_char' => (string) ($m['typed_char'] ?? ''),
                    'time_to_press_ms' => (string) ($m['time_to_press_ms'] ?? ''),
                ]);
            }
        }

        return response()->json([
            'message' => 'Session saved',
            'data' => $typingSession->load('keystrokeMistakes'),
        ], 201);
    }

    /**
     * Fetch the global leaderboard.
     */
    public function getLeaderboard(Request $request)
    {
        try {
            // 1. Kunin ang page at limit mula sa request (default: page 1, 10 items)
            $page = (int) $request->input('page', 1);
            $limit = (int) $request->input('limit', 10);
            
            // 2. Compute ang offset para makuha ang tamang batch ng users
            $offset = ($page - 1) * $limit;

            // Kinukuha lang ang pinakamataas na WPM per user_id at iga-group para walang duplicate
            $topSessions = TypingSession::select('user_id', DB::raw('MAX(wpm_score) as highest_wpm'))
                ->with('user') // Siguraduhing may public function user() sa iyong TypingSession model
                ->groupBy('user_id')
                ->orderByDesc('highest_wpm')
                ->skip($offset) // Gamitin ang computed offset
                ->take($limit)  // Gamitin ang dynamic limit
                ->get();

            $formattedLeaderboard = $topSessions->map(function ($session, $index) use ($offset) {
                // 3. Compute the absolute rank (para hindi bumalik sa 1 ang rank sa next page)
                $actualRank = $offset + $index + 1;

                // Default styles para sa mga wala sa top 3
                $rankColor = 'text-slate-500';
                $avatarRing = 'ring-slate-600';
                $hasAvatar = false;

                // Customize styles para sa top 3 (Siguraduhing sa actualRank nagbabase, hindi sa index)
                if ($actualRank === 1) {
                    $rankColor = 'text-[#00d48a]';
                    $avatarRing = 'ring-[#00d48a]';
                    $hasAvatar = true;
                } elseif ($actualRank === 2) {
                    $rankColor = 'text-[#9fa8da]';
                    $hasAvatar = true;
                } elseif ($actualRank === 3) {
                    $rankColor = 'text-[#7986cb]';
                    $hasAvatar = true;
                }

                $username = $session->user ? $session->user->name : 'Anonymous';

                return [
                    'rank' => str_pad($actualRank, 2, '0', STR_PAD_LEFT), // Formats 1 as "01", 11 as "11"
                    'user' => $username,
                    'score' => $session->highest_wpm,
                    'rankColor' => $rankColor,
                    'avatarRing' => $avatarRing,
                    'hasAvatar' => $hasAvatar,
                    'initials' => strtoupper(substr($username, 0, 2)), 
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedLeaderboard,
                // 4. Magpasa ng 'hasMore' boolean. Kung ang nakuha ay mas konti sa limit, ibig sabihin ubos na.
                'hasMore' => $topSessions->count() === $limit 
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage() 
            ], 500);
        }
    }

    public function showStats(Request $request)
    {
        // 1. Authenticate user
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 2. Fetch all sessions for global stats
        $sessions = TypingSession::where('user_id', $user->id)
            ->withCount('keystrokeMistakes')
            ->orderBy('created_at', 'desc')
            ->get();

        $highestWpm = $sessions->max('wpm_score') ?: 0;

        // 3. Fetch paginated sessions for chronology (5 per page)
        $paginatedSessions = TypingSession::where('user_id', $user->id)
            ->withCount('keystrokeMistakes')
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // 4. Format paginated sessions
        $formattedSessions = $paginatedSessions->through(function ($session) use ($highestWpm) {
            $date = Carbon::parse($session->created_at)->format('M d, Y · H:i');
            $mode = ucfirst($session->difficulty_played) . ' (' . $session->duration_seconds . 's)';

            $status = 'Normal';
            if ((int) $session->accuracy_percentage === 100) {
                $status = 'Perfect';
            } elseif ((int) $session->wpm_score >= $highestWpm && $highestWpm > 0) {
                $status = 'New Record';
            } elseif ((int) $session->wpm_score >= 120) {
                $status = 'Peak Flow';
            } elseif ((int) $session->accuracy_percentage < 95) {
                $status = 'Fatigue';
            }

            return [
                'id' => $session->id,
                'date_time' => $date,
                'mode' => $mode,
                'wpm' => (int) $session->wpm_score,
                'accuracy' => (string) $session->accuracy_percentage . '%',
                'mistakes' => (int) $session->keystroke_mistakes_count,
                'status' => $status,
            ];
        });

        // 5. Calculate chart data (last 30 sessions)
        $chartSessions = $sessions->take(30)->reverse()->values();
        $chartData = $chartSessions->map(function ($s) {
            return [
                'wpm' => (int) $s->wpm_score,
                'accuracy' => (int) $s->accuracy_percentage,
            ];
        })->values()->toArray();

        // 6. Fetch keystroke mistakes
        $sessionIds = $sessions->pluck('id')->filter()->values()->toArray();
        if (empty($sessionIds)) {
            $mistakes = collect();
        } else {
            $mistakes = keystrokeMistake::whereIn('typing_session_id', $sessionIds)->get();
        }

        // 7. Calculate heatmap data
        $heatmapData = $mistakes->groupBy(function ($m) {
            $char = $m->expected_character;
            $char = $char === null ? ' ' : $char;
            $char = trim($char) === '' ? ' ' : $char;
            return strtoupper($char);
        })->map->count()->toArray();

        // 8. Calculate trouble clusters
        $clusters = $mistakes->groupBy(function ($m) {
            $char = $m->expected_character;
            $char = $char === null ? ' ' : $char;
            $char = trim($char) === '' ? ' ' : $char;
            return strtoupper($char);
        })->map(function ($group, $key) {
            $avgLag = (int) round($group->avg(function ($item) {
                return is_numeric($item->time_to_press_ms) ? (float) $item->time_to_press_ms : (float) preg_replace('/[^0-9.]/', '', $item->time_to_press_ms);
            }));

            return [
                'key' => $key,
                'lag' => $avgLag,
                'count' => $group->count(),
            ];
        })->sortByDesc('count')->take(3)->values();

        $maxLag = $clusters->max('lag') ?: 1;
        $troubleClusters = $clusters->map(function ($c) use ($maxLag) {
            $percentage = (int) min(100, round(($c['lag'] / max($maxLag, 1)) * 100));
            return [
                'key' => $c['key'],
                'lag' => (int) $c['lag'],
                'percentage' => $percentage,
            ];
        })->values()->toArray();

        // 9. Calculate averages
        $averages = [
            'wpm' => (int) round($sessions->avg('wpm_score') ?: 0),
            'consistency' => (int) round($sessions->avg('accuracy_percentage') ?: 0),
        ];

        // 10. Render React component
        return Inertia::render('User/Stats', [
            'sessionsHistory' => $formattedSessions,
            'chartData' => $chartData,
            'heatmapData' => $heatmapData,
            'troubleClusters' => $troubleClusters,
            'averages' => $averages,
        ]);
    }
}