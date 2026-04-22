<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypingSession;
use App\Models\keystrokeMistake;

class TypingSessionController extends Controller
{
    /**
     * Store a typing session and optional keystroke mistakes from the client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'wpm_score' => 'required|integer',
            'accuracy_percentage' => 'required|integer',
            'duration_seconds' => 'required|integer',
            'difficulty_played' => 'required|string',
            'mistakes' => 'nullable|array',
            'mistakes.*.expected_character' => 'required_with:mistakes|string',
            'mistakes.*.typed_char' => 'required_with:mistakes|string',
            'mistakes.*.time_to_press_ms' => 'required_with:mistakes',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $typingSession = TypingSession::create([
            'user_id' => $user->id,
            'wpm_score' => $validated['wpm_score'],
            'accuracy_percentage' => $validated['accuracy_percentage'],
            'duration_seconds' => $validated['duration_seconds'],
            'difficulty_played' => $validated['difficulty_played'],
        ]);

        // Save keystroke mistakes if provided
        if (!empty($validated['mistakes']) && is_array($validated['mistakes'])) {
            foreach ($validated['mistakes'] as $m) {
                // Normalize fields to strings to match migration types
                $typingSession->keystrokeMistakes()->create([
                    'expected_character' => (string) ($m['expected_character'] ?? ''),
                    'typed_char' => (string) ($m['typed_char'] ?? ''),
                    'time_to_press_ms' => (string) ($m['time_to_press_ms'] ?? ''),
                ]);
            }
        }

        return response()->json([
            'message' => 'Session saved',
            'data' => $typingSession->load('keystrokeMistakes'),
        ], 201);
    }
}