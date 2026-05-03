<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\User;
use App\Models\TypingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ManageUsersController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the full list of users.
     */
    public function index(Request $request)
    {
        // Leaderboard rank map (ordered by highest WPM)
        $rankedIds = DB::table('typing_sessions')
            ->select('user_id', DB::raw('MAX(wpm_score) as highest_wpm'))
            ->groupBy('user_id')
            ->orderByDesc('highest_wpm')
            ->pluck('user_id')
            ->values();
        $rankMap = $rankedIds->flip()->map(fn($i) => $i + 1)->toArray();

        $users = User::query()
            ->withAvg('typingSessions as avg_wpm', 'wpm_score')
            ->withAvg('typingSessions as accuracy', 'accuracy_percentage')
            ->withMax('typingSessions as last_practice_at', 'created_at')
            ->withCount('typingSessions as completed_exercises')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('id', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(7)
            ->through(function ($user) use ($rankMap) {
                return [
                    'id'                  => $user->id,
                    'name'                => $user->name,
                    'email'               => $user->email,
                    'role'                => $user->role,
                    'bio'                 => $user->bio,
                    'avg_wpm'             => round($user->avg_wpm ?? 0),
                    'accuracy'            => round($user->accuracy ?? 0, 1),
                    'last_practice_at'    => $user->last_practice_at,
                    'completed_exercises' => $user->completed_exercises ?? 0,
                    'typing_rank'         => $rankMap[$user->id] ?? null,
                    'created_at'          => $user->created_at,
                ];
            });

        return Inertia::render('Admin/ManageUsers/index', [
            'users'   => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display a single user's profile.
     */
    public function show(User $user)
    {
        // Compute leaderboard rank
        $rankedIds = DB::table('typing_sessions')
            ->select('user_id', DB::raw('MAX(wpm_score) as highest_wpm'))
            ->groupBy('user_id')
            ->orderByDesc('highest_wpm')
            ->pluck('user_id')
            ->values();
        $rankIndex = $rankedIds->search($user->id);
        $typingRank = $rankIndex !== false ? $rankIndex + 1 : null;

        $lastPractice = TypingSession::where('user_id', $user->id)->max('created_at');
        $completedExercises = TypingSession::where('user_id', $user->id)->count();

        $user->loadAvg('typingSessions as avg_wpm', 'wpm_score')
             ->loadAvg('typingSessions as accuracy', 'accuracy_percentage');

        return Inertia::render('Admin/ManageUsers/show', [
            'user' => [
                'id'                  => $user->id,
                'name'                => $user->name,
                'email'               => $user->email,
                'role'                => $user->role,
                'status'              => $user->status ?? 'Active',
                'bio'                 => $user->bio,
                'avg_wpm'             => round($user->avg_wpm ?? 0),
                'accuracy'            => round($user->accuracy ?? 0, 1),
                'last_practice_at'    => $lastPractice,
                'completed_exercises' => $completedExercises,
                'typing_rank'         => $typingRank,
                'created_at'          => $user->created_at,
            ],
        ]);
    }   

    /**
     * Show the form to create a new user.
     * Renders: resources/js/Pages/Admin/ManageUsers/create.jsx
     */
    public function create()
    {
        return Inertia::render('Admin/ManageUsers/create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'role'     => 'required|in:Administrator,User',
            'status'   => 'required|in:Active,Suspended,Pending',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form to edit a user.
     * Renders: resources/js/Pages/Admin/ManageUsers/edit.jsx
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/ManageUsers/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status ?? 'Active',
            ],
        ]);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:users,email,' . $user->id,
            'role'   => 'required|in:Administrator,User',
            'status' => 'required|in:Active,Suspended,Pending',
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Suspend a user account.
     */
    public function suspend(User $user)
    {
        // Sinisiguro natin na may status column ka na gumagana
        $user->update(['status' => 'Suspended']);

        return redirect()->route('admin.users.index')
            ->with('success', "{$user->name}'s account has been suspended.");
    }

    /**
     * Reset a user's password.
     */
    public function resetPassword(User $user)
    {
        $newPassword = Str::random(12);
        $user->update(['password' => bcrypt($newPassword)]);

        return redirect()->back()
            ->with('success', "Password for {$user->name} has been reset.");
    }

    /**
     * Delete a user and all their data.
     */
    public function destroy(User $user)
    {
        try {
            $name = $user->name;
            $user->delete();

            return redirect()->route('admin.users.index')
                ->with('success', "{$name}'s data has been permanently deleted.");
        } catch (\Exception $e) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Error deleting user: ' . $e->getMessage());
        }
    }
}