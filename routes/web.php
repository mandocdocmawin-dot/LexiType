<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TypingSessionController;
use App\Http\Controllers\SystemTypingTextController;
use App\Http\Controllers\UserFeedbackController;
use App\Http\Controllers\AIAnalysisController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\CustomExerciseController;
use App\Http\Controllers\Admin\ManageUsersController;
use App\Http\Controllers\Admin\TypingTextsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canAbout' => Route::has('about'),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/about', function () {
    return Inertia::render('AboutApp');
})->name('about');

// --- PANGKALAHATANG TYPING ROUTES ---
Route::post('/typing-sessions', [TypingSessionController::class, 'store']);
Route::get('/typing-texts/random', [SystemTypingTextController::class, 'getRandomText']);
Route::get('/typing-texts/difficulties', [SystemTypingTextController::class, 'getAvailableDifficulties']);
Route::get('/typing-texts/list', [SystemTypingTextController::class, 'getTextsList']);

// --- ROUTES NA KAILANGAN NAKALOG-IN ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/stats', [TypingSessionController::class, 'showStats'])->name('stats');

    Route::resource('feedback', UserFeedbackController::class)->only(['store']);

    Route::post('/ai-analysis', [AIAnalysisController::class, 'getAnalysis']);

    // Custom Exercises
    Route::resource('custom-exercises', CustomExerciseController::class);
});

Route::get('/api/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.api');

// --- ADMIN ROUTES ---

// --- ADMIN DASHBOARD ROUTE ---
use App\Http\Controllers\Admin\OverviewController;
Route::middleware(['auth', 'isAdmin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/overview', [OverviewController::class, 'index'])->name('overview');

    Route::resource('feedback', UserFeedbackController::class)->only(['index', 'destroy']);

    // List all users
    Route::get('/users', [ManageUsersController::class, 'index'])
        ->name('users.index');

    // Show create user form
    Route::get('/users/create', [ManageUsersController::class, 'create'])
        ->name('users.create');

    // Store new user
    Route::post('/users', [ManageUsersController::class, 'store'])
        ->name('users.store');

    // Show single user profile
    Route::get('/users/{user}', [ManageUsersController::class, 'show'])
        ->name('users.show');

    // Show edit user form
    Route::get('/users/{user}/edit', [ManageUsersController::class, 'edit'])
        ->name('users.edit');

    // Update user
    Route::put('/users/{user}', [ManageUsersController::class, 'update'])
        ->name('users.update');

    // Suspend user account
    Route::patch('/users/{user}/suspend', [ManageUsersController::class, 'suspend'])
        ->name('users.suspend');

    // Reset user password
    Route::post('/users/{user}/reset-password', [ManageUsersController::class, 'resetPassword'])
        ->name('users.reset-password');

    // Delete user and all their data
    Route::delete('/users/{user}', [ManageUsersController::class, 'destroy'])
        ->name('users.destroy');

    // Lab / Custom Exercises
    Route::get('/lab', [TypingTextsController::class, 'index'])
        ->name('exercises.index');
    Route::get('/lab/create', [TypingTextsController::class, 'create'])
        ->name('exercises.create');
    Route::post('/lab', [TypingTextsController::class, 'store'])
        ->name('exercises.store');
    Route::get('/lab/{exercise}', [TypingTextsController::class, 'show'])
        ->name('exercises.show');
    Route::get('/lab/{exercise}/edit', [TypingTextsController::class, 'edit'])
        ->name('exercises.edit');
    Route::put('/lab/{exercise}', [TypingTextsController::class, 'update'])
        ->name('exercises.update');
    Route::delete('/lab/{exercise}', [TypingTextsController::class, 'destroy'])
        ->name('exercises.destroy');

});

require __DIR__.'/auth.php';