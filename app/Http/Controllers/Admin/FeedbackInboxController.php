<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FeedbackInboxController extends Controller
{
    public function index()
    {
        // TODO: Fetch feedback list
        return inertia('Admin/FeedbackInbox');
    }
}
