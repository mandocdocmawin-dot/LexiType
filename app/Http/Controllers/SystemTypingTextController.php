<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemTypingText;

class SystemTypingTextController extends Controller
{
    /**
     * Kumuha ng isang random na text base sa category at difficulty.
     */
    public function getRandomText(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'difficulty_level' => 'required|integer', // 1, 2, o 3
        ]);

        // Hanapin ang text na tugma sa category at difficulty, na active, tapos kumuha ng random (inRandomOrder)
        $text = SystemTypingText::where('category', $validated['category'])
            ->where('difficulty_level', $validated['difficulty_level'])
            ->where('is_active', true)
            ->inRandomOrder()
            ->first();

        if (!$text) {
            return response()->json(['message' => 'Walang nahanap na text para sa kategoryang ito.'], 404);
        }

        return response()->json([
            'message' => 'Success',
            'data' => $text
        ], 200);
    }
}