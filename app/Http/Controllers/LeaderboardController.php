<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $page = $request->input('page', 1);

        // 1. Fetch Paginated Leaderboard Data
        $leaderboard = DB::table('users')
            ->join('typing_sessions', 'users.id', '=', 'typing_sessions.user_id')
            ->select('users.id', 'users.name as user', DB::raw('MAX(typing_sessions.wpm_score) as score'))
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('score')
            ->paginate($limit, ['*'], 'page', $page);

        $response = [
            'success' => true,
            'data' => $leaderboard->items(),
            'current_page' => $leaderboard->currentPage(),
            'last_page' => $leaderboard->lastPage(),
        ];

        // 2. Calculate Logged-in User's Dynamic Position
        if ($request->user()) {
            $user = $request->user();
            
            // Get the current user's highest WPM
            $userMaxWpm = DB::table('typing_sessions')
                ->where('user_id', $user->id)
                ->max('wpm_score');

            if ($userMaxWpm !== null) {
                // Calculate Exact Rank: Count how many users have a strictly higher MAX(wpm_score)
                $rank = DB::table(function ($query) {
                    $query->select(DB::raw('MAX(wpm_score) as max_score'))
                          ->from('typing_sessions')
                          ->groupBy('user_id');
                }, 'max_scores')
                ->where('max_score', '>', $userMaxWpm)
                ->count() + 1;

                $response['currentUserPosition'] = [
                    'rank' => $rank,
                    'user' => $user->name,
                    'score' => $userMaxWpm
                ];
            } else {
                // Return null if user hasn't played any sessions yet
                $response['currentUserPosition'] = null; 
            }
        }

        return response()->json($response);
    }
}