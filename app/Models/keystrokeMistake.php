<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['typing_session_id', 'expected_character', 'typed_char', 'time_to_press_ms'])]
#[Hidden(['created_at', 'updated_at'])]
class keystrokeMistake extends Model
{
    use HasFactory;

    /**
     * Get the typing session that owns the keystroke mistake.
     */
    public function typingSession(): BelongsTo
    {
        return $this->belongsTo(TypingSession::class, 'typing_session_id');
    }
}
