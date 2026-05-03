<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemTypingText;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TypingTextsController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-exercises');

        $exercises = SystemTypingText::orderByDesc('updated_at')->get([
            'id', 'category', 'content', 'difficulty_level', 'is_active', 'created_at', 'updated_at'
        ]);

        $categories = SystemTypingText::select('category')->distinct()->orderBy('category')->pluck('category');

        return inertia('Admin/CustomExercises/index', [
            'exercises'  => $exercises,
            'categories' => $categories,
        ]);
    }

    public function show(SystemTypingText $exercise)
    {
        Gate::authorize('manage-exercises');

        return inertia('Admin/CustomExercises/show', [
            'exercise' => $exercise,
        ]);
    }

    public function create()
    {
        Gate::authorize('manage-exercises');

        $categories = SystemTypingText::select('category')->distinct()->orderBy('category')->pluck('category');

        return inertia('Admin/CustomExercises/create', [
            'categories' => $categories,
        ]);
    }

    public function edit(SystemTypingText $exercise)
    {
        Gate::authorize('manage-exercises');

        $categories = SystemTypingText::select('category')->distinct()->orderBy('category')->pluck('category');

        return inertia('Admin/CustomExercises/edit', [
            'exercise'   => $exercise->only([
                'id', 'category', 'content', 'difficulty_level', 'is_active',
            ]),
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-exercises');

        $data = $request->validate([
            'category'         => 'required|string|max:255',
            'content'          => 'required|string|max:5000',
            'difficulty_level' => 'required|string|in:easy,medium,hard',
            'is_active'        => 'boolean',
        ]);

        SystemTypingText::create([
            'user_id'          => auth()->id(),
            'category'         => $data['category'],
            'content'          => $data['content'],
            'difficulty_level' => $data['difficulty_level'],
            'is_active'        => $data['is_active'] ?? false,
        ]);

        return redirect()->route('admin.exercises.index')
            ->with('success', 'Exercise created successfully.');
    }

    public function update(Request $request, SystemTypingText $exercise)
    {
        Gate::authorize('manage-exercises');

        $data = $request->validate([
            'category'         => 'sometimes|required|string|max:255',
            'content'          => 'sometimes|required|string|max:5000',
            'difficulty_level' => 'sometimes|required|string|in:easy,medium,hard',
            'is_active'        => 'sometimes|boolean',
        ]);

        $exercise->update($data);

        return redirect()->route('admin.exercises.index')
            ->with('success', 'Exercise updated successfully.');
    }

    public function destroy(SystemTypingText $exercise)
    {
        Gate::authorize('manage-exercises');

        $exercise->delete();
        return redirect()->route('admin.exercises.index')
            ->with('success', 'Exercise deleted.');
    }
}
