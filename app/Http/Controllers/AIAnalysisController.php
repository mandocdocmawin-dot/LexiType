<?php

namespace App\Http\Controllers;

use App\Models\TypingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AIAnalysisController extends Controller
{
    public function getAnalysis(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // --- 1. DAILY LIMIT LOGIC ---
        $dailyLimit = 5;
        $cacheKey = 'ai_chat_count_user_' . $user->id; 
        $requestsToday = Cache::get($cacheKey, 0); 

        $bestWpm = TypingSession::where('user_id', $user->id)->max('wpm_score') ?? 0;
        $avgAccuracy = TypingSession::where('user_id', $user->id)->avg('accuracy_percentage') ?? 100;
        $focusLetters = "None yet"; 

        if ($requestsToday >= $dailyLimit) {
            return response()->json([
                'message' => "You have reached your limit of {$dailyLimit} AI questions for today. Your limit will reset tomorrow.",
                'best_wpm' => $bestWpm,
                'avg_accuracy' => round($avgAccuracy, 2),
                'focus_letters' => $focusLetters,
                'remaining_requests' => 0
            ]);
        }

        // --- 2. SETUP THE PROMPT FOR GEMINI ---
        $userQuestion = $request->input('question');
        $prompt = "You are an AI typing coach named LexiType. User Best WPM: {$bestWpm}, Accuracy: {$avgAccuracy}%. Keep answers short (1-3 sentences). IMPORTANT: You must reply in Tagalog or conversational Taglish.";
        
        if ($userQuestion) {
            $prompt .= "User question: '{$userQuestion}'.";
        } else {
            $prompt .= "Give a short, encouraging typing tip.";
        }

        // --- 3. SEND REQUEST TO GEMINI API ---
        $apiKey = env('GEMINI_API_KEY');
        $aiMessage = "Keep practicing! I need more data to analyze your typing."; 

        try {
            // prefer current v1 endpoint and a supported model; change model if you want a different tier
            $modelUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
            Log::info('Gemini request', ['url' => $modelUrl]);

            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
            ])->post($modelUrl, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiMessage = $data['candidates'][0]['content']['parts'][0]['text'] ?? $aiMessage;
                Cache::put($cacheKey, $requestsToday + 1, Carbon::tomorrow());
            } else {
                $status = $response->status();
                $body = $response->body();
                Log::error("Gemini API Error: status={$status} body={$body}");
                $aiMessage = "You have reached your limit or there is an issue with the AI.";
            }

        } catch (\Exception $e) {
            Log::error("System Error in AI: " . $e->getMessage(), ['exception' => $e]);
            $aiMessage = "Sorry, there was a system connection error. Please try again later.";
        }

        // --- 4. RETURN RESPONSE TO REACT FRONTEND ---
        return response()->json([
            'message' => $aiMessage,
            'best_wpm' => $bestWpm,
            'avg_accuracy' => round($avgAccuracy, 2),
            'focus_letters' => $focusLetters,
            'remaining_requests' => $dailyLimit - ($requestsToday + 1)
        ]);
    }
}