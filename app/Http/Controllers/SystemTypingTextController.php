<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemTypingText;

class SystemTypingTextController extends Controller
{
    /**
     * Display a listing of user's system typing texts.
     */
    public function index(Request $request)
    {
        // Assuming user-scoped records based on the original controller's logic
        $typingTexts = SystemTypingText::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get([
                'id',
                'user_id',
                'category',
                'content',
                'difficulty_level',
                'is_active',
                'created_at',
            ]);

        return inertia('Admin/SystemTypingTexts/index', [
            'texts' => $typingTexts,
        ]);
    }

    /**
     * Show the form for creating a new system typing text.
     */
    public function create()
    {
        return inertia('Admin/SystemTypingTexts/create');
    }

    /**
     * Store a newly created system typing text in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'difficulty_level' => 'required|in:easy,medium,hard',
            'is_active' => 'boolean',
        ]);

        SystemTypingText::create([
            'user_id' => auth()->id(),
            'category' => $validated['category'],
            'content' => $validated['content'],
            'difficulty_level' => $validated['difficulty_level'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        return redirect()->route('admin.typing-texts.index')
            ->with('success', 'Typing text created successfully.');
    }

    /**
     * Display the specified system typing text.
     */
    public function show(SystemTypingText $typingText)
    {
        $this->authorize('view', $typingText);

        return inertia('Admin/SystemTypingTexts/show', [
            'text' => $typingText,
        ]);
    }

    /**
     * Show the form for editing the specified system typing text.
     */
    public function edit(SystemTypingText $typingText)
    {
        $this->authorize('update', $typingText);

        return inertia('Admin/SystemTypingTexts/edit', [
            'text' => $typingText->only([
                'id',
                'category',
                'content',
                'difficulty_level',
                'is_active',
            ]),
        ]);
    }

    /**
     * Update the specified system typing text in storage.
     */
    public function update(Request $request, SystemTypingText $typingText)
    {
        $this->authorize('update', $typingText);

        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string|max:5000',
            'difficulty_level' => 'sometimes|required|in:easy,medium,hard',
            'is_active' => 'sometimes|boolean',
        ]);

        $typingText->update($validated);

        return redirect()->route('admin.typing-texts.index')
            ->with('success', 'Typing text updated successfully.');
    }

    /**
     * Remove the specified system typing text from storage.
     */
    public function destroy(SystemTypingText $typingText)
    {
        $this->authorize('delete', $typingText);

        $typingText->delete();

        return redirect()->route('admin.typing-texts.index')
            ->with('success', 'Typing text deleted successfully.');
    }

    /**
     * Get a random text based on category and difficulty.
     */
    public function getRandomText(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'difficulty_level' => 'required',
        ]);

        $category = $validated['category'];
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

        $available = SystemTypingText::where('category', $category)
            ->where('is_active', true)
            ->pluck('difficulty_level')
            ->unique()
            ->values()
            ->toArray();

        if (empty($available)) {
            return response()->json(['message' => 'No available text found for the specified category.'], 404);
        }

        $desiredInt = $this->difficultyToInt($difficulty);
        $availableMap = [];
        foreach ($available as $a) {
            $ai = $this->difficultyToInt($a);
            if ($ai !== null) {
                $availableMap[$ai] = $a;
            }
        }

        if (!empty($availableMap) && $desiredInt !== null) {
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
            $chosenDifficultyValue = $available[array_rand($available)];
        }

        $text = SystemTypingText::where('category', $category)
            ->where('is_active', true)
            ->where('difficulty_level', $chosenDifficultyValue)
            ->inRandomOrder()
            ->first();

        if (!$text) {
            $text = SystemTypingText::where('category', $category)
                ->where('is_active', true)
                ->inRandomOrder()
                ->first();

            if (!$text) {
                return response()->json(['message' => 'No available text found for the specified category.'], 404);
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
     * Return all active texts for a given category and difficulty.
     */
    public function getTextsList(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'difficulty_level' => 'required',
        ]);

        $category = $validated['category'];
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

        $texts = SystemTypingText::where('category', $category)
            ->where('is_active', true)
            ->where(function ($q) use ($difficulty, $diffText) {
                $q->where('difficulty_level', $difficulty);
                if ($diffText !== null) {
                    $q->orWhere('difficulty_level', $diffText);
                }
            })
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'message' => 'Success',
            'data' => $texts
        ], 200);
    }

    /**
     * Returns a list of available difficulty levels for a category.
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
            return response()->json(['message' => 'No available difficulties found for the specified category.', 'available' => []], 200);
        }

        $normalized = [];
        foreach ($available as $a) {
            $ai = $this->difficultyToInt($a);
            if ($ai !== null) {
                $normalized[$ai] = $this->intToLabel($ai);
            } else {
                $normalized[$a] = $a;
            }
        }

        ksort($normalized, SORT_NUMERIC);

        return response()->json([
            'message' => 'Success',
            'available' => array_values($normalized)
        ], 200);
    }

    /**
     * Convert difficulty string or number to an integer representation.
     */
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

    /**
     * Convert integer difficulty to its string label.
     */
    private function intToLabel($i)
    {
        $map = [1 => 'easy', 2 => 'medium', 3 => 'hard'];
        return $map[intval($i)] ?? null;
    }
}