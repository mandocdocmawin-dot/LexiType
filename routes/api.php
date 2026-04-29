<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\TypingSessionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/leaderboard', [TypingSessionController::class, 'getLeaderboard']);

// Temporary test route to exercise Gemini API and write full response to log
Route::get('/ai-analysis-test', function () {
    $apiKey = env('GEMINI_API_KEY');
    $prompt = "Test prompt from dev";

    try {
        $response = Http::withoutVerifying()->withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);

        if ($response->successful()) {
            Log::info('Gemini API OK: status=' . $response->status() . ' body=' . $response->body());
        } else {
            Log::error('Gemini API Error: status=' . $response->status() . ' body=' . $response->body());
        }
    } catch (\Exception $e) {
        Log::error('System Error in AI: ' . $e->getMessage(), ['exception' => $e]);
    }

    return response()->json(['test' => 'done']);
});