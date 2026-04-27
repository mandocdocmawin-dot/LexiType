<?php

namespace App\Http\Controllers;

use App\Models\UserFeedback; // Assuming you have a model for the user_feedbacks table
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserFeedbackController extends Controller
{
    /**
     * Retrieve all feedback data to be displayed on the Admin view.
     */
    public function index()
    {
        // Fetch feedbacks with the associated user data, ordered by newest first
        $feedbacks = UserFeedback::with('user')->latest()->get();

        return Inertia::render('Admin/FeedbackIndex', [
            'feedbacks' => $feedbacks
        ]);
    }

    /**
     * Save the category and message submitted by the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Create feedback linked to the authenticated user
        UserFeedback::create([
            'user_id' => auth()->id(),
            'category' => $validated['category'],
            'message' => $validated['message'],
        ]);

        return redirect()->back()->with('success', 'Feedback submitted successfully.');
    }

    /**
     * Allow the Admin to delete a specific feedback record.
     */
    public function destroy($id)
    {
        $feedback = UserFeedback::findOrFail($id);
        $feedback->delete();

        return redirect()->back()->with('success', 'Feedback deleted successfully.');
    }
}