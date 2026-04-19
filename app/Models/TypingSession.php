<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['user_id', 'wpm_score', 'accuracy_percentage', 'duration_seconds'])]
#[Hidden(['created_at', 'updated_at'])]
class TypingSession extends Model
{
    use HasFactory;

    /**
     * Get the user that owns the typing session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the keystroke mistakes for the typing session.
     */

    public function keystrokeMistakes(): HasMany
    {
        return $this->hasMany(keystrokeMistake::class, 'typing_session_id');
    }
}
