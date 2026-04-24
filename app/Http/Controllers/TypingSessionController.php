<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypingSession;
use App\Models\keystrokeMistake;
use Illuminate\Support\Facades\DB;

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
}