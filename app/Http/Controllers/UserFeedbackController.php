<?php

namespace App\Http\Controllers;

use App\Models\UserFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate; // Idagdag ito

class UserFeedbackController extends Controller
{
    public function index()
    {
        // Check kung admin bago ipakita lahat
        Gate::authorize('viewAny', UserFeedback::class);

        $feedbacks = UserFeedback::with('user')->latest()->paginate(7);

        return Inertia::render('Admin/Feedbacks/FeedbackIndex', [
            'feedbacks' => $feedbacks
        ]);
    }

    public function store(Request $request)
    {
        // Check kung pwedeng mag-create (nakaset sa true sa policy)
        Gate::authorize('create', UserFeedback::class);

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        UserFeedback::create([
            'user_id' => auth()->id(),
            'category' => $validated['category'],
            'message' => $validated['message'],
        ]);

        return redirect()->back()->with('success', 'Feedback submitted successfully.');
    }

    public function show($id)
    {
        $feedback = UserFeedback::with('user')->findOrFail($id);
        
        // Check kung pwedeng i-view ni user itong specific feedback na ito
        Gate::authorize('view', $feedback);

        return Inertia::render('Admin/Feedbacks/show', [
            'feedback' => $feedback
        ]);
    }

    public function destroy($id)
    {
        $feedback = UserFeedback::findOrFail($id);
        
        // Check kung admin at pwedeng mag-delete
        Gate::authorize('delete', $feedback);
        
        $feedback->delete();

        return redirect()->back()->with('success', 'Feedback deleted successfully.');
    }
}