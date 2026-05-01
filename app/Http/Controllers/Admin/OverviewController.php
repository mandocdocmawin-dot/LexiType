<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OverviewController extends Controller
{
    public function index()
    {
        // TODO: Fetch stats and recent sessions
        return inertia('Admin/Overview');
    }
}
