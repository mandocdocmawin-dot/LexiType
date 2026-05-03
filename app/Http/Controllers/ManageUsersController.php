<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\User;
use Illuminate\Http\Request;
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
        $users = User::query()
            // 1. Calculate averages directly from the typing_sessions table
            ->withAvg('typingSessions as avg_wpm', 'wpm_score')
            ->withAvg('typingSessions as accuracy', 'accuracy_percentage')
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
                    'status' => $user->status ?? 'Active',
                    'bio' => $user->bio,
                    
                    // 2. Map the dynamically calculated averages (defaulting to 0 if no sessions exist)
                    // We use round() to keep the numbers clean for the UI.
                    'avg_wpm' => round($user->avg_wpm ?? 0),
                    'accuracy' => round($user->accuracy ?? 0, 1),
                    
                    'account_type' => 'free',
                    'mfa_enabled' => false,
                    'last_login_at' => null,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('Admin/ManageUsers/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Display a single user's profile.
     */
    public function show(User $user)
    {
        // 3. Use loadAvg() for a single model instance
        $user->loadAvg('typingSessions as avg_wpm', 'wpm_score')
             ->loadAvg('typingSessions as accuracy', 'accuracy_percentage');
        
        return Inertia::render('Admin/ManageUsers/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status ?? 'Active',
                'bio' => $user->bio,
                
                // 4. Map the averages just like in the index method
                'avg_wpm' => round($user->avg_wpm ?? 0),
                'accuracy' => round($user->accuracy ?? 0, 1),
                
                'account_type' => 'free',
                'mfa_enabled' => false,
                'last_login_at' => null,
                'created_at' => $user->created_at,
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
            'role'     => 'required|in:Administrator,Moderator,Member',
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