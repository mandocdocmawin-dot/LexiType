<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageUsersController extends Controller
{
    /**
     * Display the full list of users.
     * Renders: resources/js/Pages/Admin/ManagerUsers/index.jsx
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->with(['profile', 'stats'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('id', 'like', "%{$search}%");
                });
            })
            ->when($request->role && $request->role !== 'All Roles', function ($query) use ($request) {
                $query->where('role', $request->role);
            })
            ->when($request->status && $request->status !== 'All Status', function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'bio' => $user->profile?->bio,
                    'avg_wpm' => $user->stats?->average_wpm ?? 0,
                    'accuracy' => $user->accuracy,
                    'account_type' => $user->account_type,
                    'mfa_enabled' => $user->mfa_enabled,
                    'last_login_at' => $user->last_login_at,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('Admin/ManagerUsers/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Display a single user's profile.
     * Renders: resources/js/Pages/Admin/ManagerUsers/show.jsx
     */
    public function show(User $user)
    {
        $user->load(['profile', 'stats']);
        
        return Inertia::render('Admin/ManagerUsers/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'bio' => $user->profile?->bio,
                'avg_wpm' => $user->stats?->average_wpm ?? 0,
                'accuracy' => $user->accuracy,
                'account_type' => $user->account_type,
                'mfa_enabled' => $user->mfa_enabled,
                'last_login_at' => $user->last_login_at,
                'created_at' => $user->created_at,
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
            'role'     => 'required|in:Administrator,Moderator,Member',
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
            'role'   => 'required|in:Administrator,Moderator,Member',
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