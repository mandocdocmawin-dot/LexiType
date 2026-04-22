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

        $category = $validated['category'];
        $difficulty = $validated['difficulty_level'];

        // Normalize difficulty: accept either numeric (1,2,3) or strings ('easy','medium','hard').
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

        // Try to find exact matches first (accept both numeric and text forms)
        $text = SystemTypingText::where('category', $category)
            ->where('is_active', true)
            ->where(function ($q) use ($difficulty, $diffText) {
                $q->where('difficulty_level', $difficulty);
                if ($diffText !== null) {
                    $q->orWhere('difficulty_level', $diffText);
                }
            })
            ->inRandomOrder()
            ->first();

        if ($text) {
            return response()->json([
                'message' => 'Success',
                'data' => $text,
                'requested_difficulty' => $difficulty,
                'actual_difficulty' => $text->difficulty_level,
                'is_fallback' => false
            ], 200);
        }

        // If not found, get available difficulties for the category
        $available = SystemTypingText::where('category', $category)
            ->where('is_active', true)
            ->pluck('difficulty_level')
            ->unique()
            ->values()
            ->toArray();

        if (empty($available)) {
            return response()->json(['message' => 'Walang nahanap na text para sa kategoryang ito.'], 404);
        }

        // Try to pick the closest difficulty (if possible) else pick a random available
        $desiredInt = $this->difficultyToInt($difficulty);
        $availableMap = [];
        foreach ($available as $a) {
            $ai = $this->difficultyToInt($a);
            if ($ai !== null) {
                // store original value so we can query the exact stored format
                $availableMap[$ai] = $a;
            }
        }

        if (!empty($availableMap) && $desiredInt !== null) {
            // find closest integer key
            $closest = null;
            foreach (array_keys($availableMap) as $ai) {
                if ($closest === null) {
                    $closest = $ai;
                    continue;
                }
                if (abs($ai - $desiredInt) < abs($closest - $desiredInt)) {
                    $closest = $ai;
                }
            }
            $chosenDifficultyValue = $availableMap[$closest];
        } else {
            // fallback: choose random from available (keep the original stored value)
            $chosenDifficultyValue = $available[array_rand($available)];
        }

        $text = SystemTypingText::where('category', $category)
            ->where('is_active', true)
            ->where('difficulty_level', $chosenDifficultyValue)
            ->inRandomOrder()
            ->first();

        if (!$text) {
            // as a last resort, return any text in the category
            $text = SystemTypingText::where('category', $category)
                ->where('is_active', true)
                ->inRandomOrder()
                ->first();

            if (!$text) {
                return response()->json(['message' => 'Walang nahanap na text para sa kategoryang ito.'], 404);
            }
            return response()->json([
                'message' => 'Success (fallback to any)',
                'data' => $text,
                'requested_difficulty' => $difficulty,
                'actual_difficulty' => $text->difficulty_level,
                'is_fallback' => true
            ], 200);
        }

        return response()->json([
            'message' => 'Success (fallback)',
            'data' => $text,
            'requested_difficulty' => $difficulty,
            'actual_difficulty' => $text->difficulty_level,
            'is_fallback' => true
        ], 200);
    }

    /**
     * Returns list of available difficulty levels for a category (normalized to 'easy','medium','hard')
     */
    public function getAvailableDifficulties(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string'
        ]);

        $available = SystemTypingText::where('category', $validated['category'])
            ->where('is_active', true)
            ->pluck('difficulty_level')
            ->unique()
            ->values()
            ->toArray();

        if (empty($available)) {
            return response()->json(['message' => 'Walang available na difficulty para sa kategoryang ito.', 'available' => []], 200);
        }

        $normalized = [];
        foreach ($available as $a) {
            $ai = $this->difficultyToInt($a);
            if ($ai !== null) {
                $normalized[$ai] = $this->intToLabel($ai);
            } else {
                // unknown format; include as-is
                $normalized[$a] = $a;
            }
        }

        // Return as ordered by integer keys if possible
        ksort($normalized, SORT_NUMERIC);

        return response()->json([
            'message' => 'Success',
            'available' => array_values($normalized)
        ], 200);
    }

    private function difficultyToInt($d)
    {
        if (is_numeric($d)) {
            $i = intval($d);
            if (in_array($i, [1,2,3])) return $i;
            return null;
        }
        $lower = strtolower($d);
        $map = ['easy' => 1, 'medium' => 2, 'hard' => 3];
        return $map[$lower] ?? null;
    }

    private function intToLabel($i)
    {
        $map = [1 => 'easy', 2 => 'medium', 3 => 'hard'];
        return $map[intval($i)] ?? null;
    }
}