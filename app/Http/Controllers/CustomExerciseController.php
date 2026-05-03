<?php

namespace App\Http\Controllers;

use App\Models\CustomExercise;
use Illuminate\Http\Request;

class CustomExerciseController extends Controller
{
    /**
     * Display a listing of user's custom exercises.
     */
    public function index(Request $request)
    {
        $customExercises = auth()->user()->customExercises()
            ->orderByDesc('created_at')
            ->get([
                'id',
                'user_id',
                'custom_text',
                'is_completed',
                'created_at',
                'updated_at',
            ]);

        return inertia('User/CustomExercises/index', [
            'exercises' => $customExercises,
        ]);
    }

    /**
     * Show the form for creating a new custom exercise.
     */
    public function create()
    {
        return inertia('User/CustomExercises/create');
    }

    /**
     * Store a newly created custom exercise in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'custom_text' => 'required|string|max:5000',
            'is_completed' => 'boolean',
        ]);

        auth()->user()->customExercises()->create([
            'custom_text' => $validated['custom_text'],
            'is_completed' => $validated['is_completed'] ?? false,
        ]);

        return redirect()->route('custom-exercises.index')
            ->with('success', 'Custom exercise created successfully.');
    }

    /**
     * Display the specified custom exercise.
     */
    public function show(CustomExercise $customExercise)
    {
        // Authorize user can only view their own exercises
        $this->authorize('view', $customExercise);

        return inertia('User/CustomExercises/show', [
            'exercise' => $customExercise,
        ]);
    }

    /**
     * Show the form for editing the specified custom exercise.
     */
    public function edit(CustomExercise $customExercise)
    {
        // Authorize user can only edit their own exercises
        $this->authorize('update', $customExercise);

        return inertia('User/CustomExercises/edit', [
            'exercise' => $customExercise->only([
                'id',
                'custom_text',
                'is_completed',
            ]),
        ]);
    }

    /**
     * Update the specified custom exercise in storage.
     */
    public function update(Request $request, CustomExercise $customExercise)
    {
        // Authorize user can only update their own exercises
        $this->authorize('update', $customExercise);

        $validated = $request->validate([
            'custom_text' => 'sometimes|required|string|max:5000',
            'is_completed' => 'sometimes|boolean',
        ]);

        $customExercise->update($validated);

        return redirect()->route('custom-exercises.index')
            ->with('success', 'Custom exercise updated successfully.');
    }

    /**
     * Remove the specified custom exercise from storage.
     */
    public function destroy(CustomExercise $customExercise)
    {
        // Authorize user can only delete their own exercises
        $this->authorize('delete', $customExercise);

        $customExercise->delete();

        return redirect()->route('custom-exercises.index')
            ->with('success', 'Custom exercise deleted successfully.');
    }
}
