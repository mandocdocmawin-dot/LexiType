<?php

namespace App\Policies;

use App\Models\User;
use App\Models\CustomExercise;

class CustomExercisePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CustomExercise $customExercise): bool
    {
        return $user->id === $customExercise->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CustomExercise $customExercise): bool
    {
        return $user->id === $customExercise->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CustomExercise $customExercise): bool
    {
        return $user->id === $customExercise->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CustomExercise $customExercise): bool
    {
        return $user->id === $customExercise->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CustomExercise $customExercise): bool
    {
        return $user->id === $customExercise->user_id;
    }
}
