<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TypingSessionController; 
use App\Http\Controllers\SystemTypingTextController;
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

Route::post('/typing-sessions', [TypingSessionController::class, 'store']);
Route::get('/typing-texts/random', [SystemTypingTextController::class, 'getRandomText']);
Route::get('/typing-texts/difficulties', [SystemTypingTextController::class, 'getAvailableDifficulties']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';
