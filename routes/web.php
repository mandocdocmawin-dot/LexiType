<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TypingSessionController; 
use App\Http\Controllers\SystemTypingTextController;
use App\Http\Controllers\UserFeedbackController;
use App\Http\Controllers\AIAnalysisController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\DashboardController; 
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

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('verified')
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/stats', [TypingSessionController::class, 'showStats'])->name('stats');
    Route::resource('feedback', UserFeedbackController::class)->only(['store']);
    Route::post('/ai-analysis', [AIAnalysisController::class, 'getAnalysis']);
});

Route::get('/api/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.api');

// --- ADMIN ROUTES ---
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('feedback', UserFeedbackController::class)->only(['index', 'destroy']);
});

require __DIR__.'/auth.php';