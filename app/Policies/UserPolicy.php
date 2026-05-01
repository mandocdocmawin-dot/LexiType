<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
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
