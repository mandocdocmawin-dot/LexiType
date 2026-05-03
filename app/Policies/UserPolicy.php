<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user can view any users.
     */
    public function viewAny(User $admin): bool
    {
        return $admin->isAdminOrModerator();
    }

    /**
     * Determine if the user can view a specific user.
     */
    public function view(User $admin, User $user): bool
    {
        return $admin->isAdminOrModerator();
    }

    /**
     * Determine if the user can create new users.
     */
    public function create(User $admin): bool
    {
        return $admin->isAdmin();
    }

    /**
     * Determine if the user can update a user.
     */
    public function update(User $admin, User $user): bool
    {
        return $admin->isAdmin();
    }

    /**
     * Determine if the user can delete the model.
     */
    public function delete(User $admin, User $user): bool
    {
        // Only administrators can delete users
        return $admin->isAdmin();
    }

    /**
     * Determine if the user can permanently delete the model.
     */
    public function forceDelete(User $admin, User $user): bool
    {
        return $admin->isAdmin();
    }
}
