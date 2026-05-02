<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserFeedback;
use Illuminate\Auth\Access\Response;

class UserFeedbackPolicy
{
    /**
     * Determine whether the user can view any models (Admin only).
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the model (Admin only).
     */
    public function view(User $user, UserFeedback $userFeedback): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can create models (Any authenticated user).
     */
    public function create(User $user): bool
    {
        return true; 
    }

    /**
     * Determine whether the user can delete the model (Admin only).
     */
    public function delete(User $user, UserFeedback $userFeedback): bool
    {
        return $user->role === 'admin';
    }
}