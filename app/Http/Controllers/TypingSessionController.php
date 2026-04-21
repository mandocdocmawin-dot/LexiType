<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypingSession;
use Illuminate\Support\Facades\Auth;

class TypingSessionController extends Controller
{
    public function store(Request $request)
    {
        // [BAGONG LOGIC]: I-check agad kung Guest. Kung walang naka-login, wag i-save.
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Guest player session. Hindi isinave sa database.'
            ], 200);
        }

        // 1. I-validate ang incoming data kasama ang difficulty_played
        $validated = $request->validate([
            'wpm_score'           => 'required|integer',
            'accuracy_percentage' => 'required|numeric',
            'duration_seconds'    => 'required|integer',
            'difficulty_played'   => 'required|string',
        ]);

        // 2. I-save sa database (Dahil pumasa sa Auth::check(), siguradong may ID ito)
        $session = TypingSession::create([
            'user_id'             => Auth::id(),
            'wpm_score'           => $validated['wpm_score'],
            'accuracy_percentage' => $validated['accuracy_percentage'],
            'duration_seconds'    => $validated['duration_seconds'],
            'difficulty_played'   => $validated['difficulty_played'],
        ]);

        // 3. Ibalik ang data sa React
        return response()->json([
            'message' => 'Typing session saved successfully!',
            'data'    => $session
        ], 201);
    }
}