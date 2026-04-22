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
            'difficulty_level' => 'required', // accept numeric (1/2/3) or text (easy/medium/hard)
        ]);

        // Normalize difficulty: accept either numeric (1,2,3) or strings ('easy','medium','hard').
        $difficulty = $validated['difficulty_level'];
        $map = [1 => 'easy', 2 => 'medium', 3 => 'hard'];
        $diffText = null;
        if (is_numeric($difficulty)) {
            $diffInt = intval($difficulty);
            $diffText = $map[$diffInt] ?? null;
        } else {
            $lower = strtolower($difficulty);
            if (in_array($lower, ['easy', 'medium', 'hard'])) {
                $diffText = $lower;
            }
        }

        // Hanapin ang text na tugma sa category at difficulty (tumingin sa numeric o text form), na active, tapos kumuha ng random (inRandomOrder)
        $text = SystemTypingText::where('category', $validated['category'])
            ->where('is_active', true)
            ->where(function ($q) use ($difficulty, $diffText) {
                $q->where('difficulty_level', $difficulty);
                if ($diffText !== null) {
                    $q->orWhere('difficulty_level', $diffText);
                }
            })
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