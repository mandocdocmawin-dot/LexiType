<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\TypingSession;
use App\Models\UserFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Admin lang ang may access sa dashboard na ito
        if (! $request->user()->isAdmin()) {
            return redirect('/');
        }

        // 1. Calculate Top Statistics
        $totalUsers = User::count();
        $averageWpm = (int) TypingSession::avg('wpm_score');
        $averageAccuracy = round(TypingSession::avg('accuracy_percentage') ?? 0, 1);

        // 2. Fetch Latest Feedback Inbox
        $feedbacks = UserFeedback::with('user:id,name')
            ->latest()
            ->take(11)
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'user_name' => $feedback->user->name ?? 'System',
                    'category' => $feedback->category,
                    'message' => $feedback->message,
                    'time_ago' => $feedback->created_at->diffForHumans(),
                ];
            });

        // 3. Fetch Active Management Users
        $activeUsers = User::with(['typingSessions' => function ($query) {
                $query->latest()->take(1);
            }])
            ->whereHas('typingSessions')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                $latestSession = $user->typingSessions->first();
                $wpm = $latestSession ? $latestSession->wpm_score : 0;

                // Dynamic tier calculation based on WPM
                $tier = 'Novice';
                if ($wpm >= 100) {
                    $tier = 'Grandmaster';
                } elseif ($wpm >= 70) {
                    $tier = 'Master';
                } elseif ($wpm >= 40) {
                    $tier = 'Pro';
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'wpm' => $wpm,
                    'tier' => $tier,
                ];
            });

        // 4. Retrieve API Health Status
        $systemHealth = Cache::get(
            'system_health_ai_api',
            'Healthy: Load balancing optimal. All sub-modules reporting normal parameters.'
        );

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => number_format($totalUsers),
                'averageWpm' => $averageWpm,
                'averageAccuracy' => $averageAccuracy,
            ],
            'feedbacks' => $feedbacks,
            'activeUsers' => $activeUsers,
            'systemHealth' => $systemHealth,
        ]);
    }
}