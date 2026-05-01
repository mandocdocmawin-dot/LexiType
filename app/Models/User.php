<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

#[Fillable(['name', 'email', 'password', 'role', 'status', 'accuracy', 'account_type', 'mfa_enabled', 'last_login_at'])]  
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable  
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        $role = strtolower($this->role ?? '');
        return in_array($role, ['admin', 'administrator']);
    }   

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class, 'user_id');
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(UserFeedback::class, 'user_id');
    }

    public function customExercises(): HasMany
    {
        return $this->hasMany(CustomExercise::class, 'user_id');
    }

    public function systemTypingTexts(): HasMany
    {
        return $this->hasMany(SystemTypingText::class, 'user_id');
    }

    public function aiRecommendations(): HasMany
    {
        return $this->hasMany(AIRecommendation::class, 'user_id');
    }

    public function stats(): HasOne
    {
        return $this->hasOne(UserStat::class, 'user_id');
    }

    public function typingSessions(): HasMany
    {
        return $this->hasMany(TypingSession::class, 'user_id');
    }
}
