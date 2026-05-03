<?php

namespace App\Policies;

use App\Models\SystemTypingText;
use App\Models\User;

class SystemTypingTextPolicy
{
    /**
     * Determine whether the user can view any exercises.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdminOrModerator();
    }

    /**
     * Determine whether the user can view the exercise.
     */
    public function view(User $user, SystemTypingText $exercise): bool
    {
        return $user->isAdminOrModerator();
    }

    /**
     * Determine whether the user can create exercises.
     */
    public function create(User $user): bool
    {
        return $user->isAdminOrModerator();
    }

    /**
     * Determine whether the user can update the exercise.
     */
    public function update(User $user, SystemTypingText $exercise): bool
    {
        return $user->isAdminOrModerator();
    }

    /**
     * Determine whether the user can delete the exercise.
     */
    public function delete(User $user, SystemTypingText $exercise): bool
    {
        return $user->isAdminOrModerator();
    }
}