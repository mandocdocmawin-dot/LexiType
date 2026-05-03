<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view the list of users (index).
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Pwedeng makita ng user ang sarili niya, o ng admin ang lahat
        return $user->id === $model->id || $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Ang user lang ang pwedeng mag-edit ng sarili niyang profile, o kaya ay admin
        return $user->id === $model->id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Ang user lang ang pwedeng mag-delete ng sarili niyang account, o kaya ay admin
        return $user->id === $model->id || $user->role === 'admin';
    }
}