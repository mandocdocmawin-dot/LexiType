<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypingSession;
use Illuminate\Support\Facades\Auth;

class TypingSessionController extends Controller
{
    public function store(Request $request)
    {
        // 1. I-validate ang incoming data base sa kung ano lang ang nasa Fillable mo
        $validated = $request->validate([
            'wpm_score' => 'required|integer',
            'accuracy_percentage' => 'required|numeric',
            'duration_seconds' => 'required|integer',
        ]);

        // 2. I-setup ang default User ID (null kapag Guest)
        $userId = null;

        // 3. I-check kung may naka-login na user
        // Siguraduhing gamit ang API guard (Sanctum) kung React frontend ang gamit
        if (Auth::guard('sanctum')->check()) { 
            $userId = Auth::guard('sanctum')->id();
        }

        // 4. I-save ang laro sa database
        $session = TypingSession::create([
            'user_id'             => $userId,
            'wpm_score'           => $validated['wpm_score'],
            'accuracy_percentage' => $validated['accuracy_percentage'],
            'duration_seconds'    => $validated['duration_seconds'],
        ]);

        // 5. Ibalik ang data sa React
        return response()->json([
            'message' => 'Typing session saved successfully!',
            'data' => $session
        ], 201);
    }
}