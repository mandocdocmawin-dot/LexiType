<?php

namespace App\Policies;

use App\Models\SystemTypingText;
use App\Models\User;

class SystemTypingTextPolicy
{

    public function viewAny(User $user): bool
    {
        return true; 
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, SystemTypingText $systemTypingText): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, SystemTypingText $systemTypingText): bool
    {
        return $user->role === 'admin';
    }
}