<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TypingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ManageUsersController extends Controller
{
    /**
     * Display the full list of users.
     * Renders: resources/js/Pages/Admin/ManagerUsers/index.jsx
     */
    public function index(Request $request)
    {
        // Build leaderboard ranks (rank by highest WPM per user)
        $rankedIds = DB::table('typing_sessions')
            ->select('user_id', DB::raw('MAX(wpm_score) as highest_wpm'))
            ->groupBy('user_id')
            ->orderByDesc('highest_wpm')
            ->pluck('user_id')
            ->values();
        $rankMap = $rankedIds->flip()->map(fn($i) => $i + 1)->toArray();

        $users = User::query()
            ->with(['profile', 'stats'])
            ->withMax('typingSessions as last_practice_at', 'created_at')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('id', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) use ($rankMap) {
                return [
                    'id'                  => $user->id,
                    'name'                => $user->name,
                    'email'               => $user->email,
                    'role'                => $user->role,
                    'bio'                 => $user->profile?->bio,
                    'avg_wpm'             => $user->stats?->average_wpm ?? 0,
                    'accuracy'            => $user->accuracy,
                    'account_type'        => $user->account_type,
                    'mfa_enabled'         => $user->mfa_enabled,
                    'last_practice_at'    => $user->last_practice_at,
                    'completed_exercises' => $user->stats?->total_tests_taken ?? 0,
                    'typing_rank'         => $rankMap[$user->id] ?? null,
                    'created_at'          => $user->created_at,
                ];
            });

        return Inertia::render('Admin/ManagerUsers/index', [
            'users'   => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display a single user's profile.
     * Renders: resources/js/Pages/Admin/ManagerUsers/show.jsx
     */
    public function show(User $user)
    {
        $user->load(['profile', 'stats']);

        // Compute leaderboard rank
        $rankedIds = DB::table('typing_sessions')
            ->select('user_id', DB::raw('MAX(wpm_score) as highest_wpm'))
            ->groupBy('user_id')
            ->orderByDesc('highest_wpm')
            ->pluck('user_id')
            ->values();
        $rankIndex = $rankedIds->search($user->id);
        $typingRank = $rankIndex !== false ? $rankIndex + 1 : null;

        // Last practice date
        $lastPractice = TypingSession::where('user_id', $user->id)->max('created_at');

        return Inertia::render('Admin/ManagerUsers/show', [
            'user' => [
                'id'                  => $user->id,
                'name'                => $user->name,
                'email'               => $user->email,
                'role'                => $user->role,
                'status'              => $user->status,
                'bio'                 => $user->profile?->bio,
                'avg_wpm'             => $user->stats?->average_wpm ?? 0,
                'accuracy'            => $user->accuracy,
                'account_type'        => $user->account_type,
                'mfa_enabled'         => $user->mfa_enabled,
                'last_practice_at'    => $lastPractice,
                'completed_exercises' => $user->stats?->total_tests_taken ?? 0,
                'typing_rank'         => $typingRank,
                'created_at'          => $user->created_at,
            ],
        ]);
    }

    /**
     * Show the form to create a new user.
     * Renders: resources/js/Pages/Admin/ManagerUsers/create.jsx
     */
    public function create()
    {
        return Inertia::render('Admin/ManagerUsers/create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'role'     => 'required|in:admin,Administrator,Moderator,Member',
            'status'   => 'required|in:Active,Suspended,Pending',
            'password' => 'required|string|min:8|confirmed',
            'accuracy' => 'nullable|numeric|min:0|max:100',
            'account_type' => 'nullable|in:free,premium',
            'mfa_enabled' => 'nullable|boolean',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['accuracy'] = $validated['accuracy'] ?? 0;
        $validated['account_type'] = $validated['account_type'] ?? 'free';
        $validated['mfa_enabled'] = $validated['mfa_enabled'] ?? false;

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form to edit a user.
     * Renders: resources/js/Pages/Admin/ManagerUsers/edit.jsx
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/ManagerUsers/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
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
            'role'   => 'required|in:admin,Administrator,Moderator,Member',
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
        $user->update(['status' => 'Suspended']);

        return redirect()->route('admin.users.index')
            ->with('success', "{$user->name}'s account has been suspended.");
    }

    /**
     * Reset a user's password.
     */
    public function resetPassword(User $user)
    {
        $newPassword = \Str::random(12);
        $user->update(['password' => bcrypt($newPassword)]);

        // Optionally send the new password via email here
        // Mail::to($user->email)->send(new PasswordResetMail($newPassword));

        return redirect()->back()
            ->with('success', "Password for {$user->name} has been reset.");
    }

    /**
     * Delete a user and all their data.
     */
    public function destroy(User $user)
    {
        // Authorize the delete action
        $this->authorize('delete', $user);

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
    use AuthorizesRequests;
}