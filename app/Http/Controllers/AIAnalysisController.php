<?php

namespace App\Http\Controllers;

use App\Models\TypingSession;
use App\Models\keystrokeMistake;
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

        $dailyLimit = 6;
        
        $cacheKey = 'ai_limit_v3_user_' . $user->id; 
        
        $cacheData = Cache::get($cacheKey, [
            'count' => 0,
            'reset_at' => Carbon::tomorrow()->toDateTimeString() 
        ]); 

        $requestsToday = $cacheData['count'];
        
        $resetDateObj = Carbon::parse($cacheData['reset_at']);

        $bestWpm = TypingSession::where('user_id', $user->id)->max('wpm_score') ?? 0;
        $avgAccuracy = TypingSession::where('user_id', $user->id)->avg('accuracy_percentage') ?? 100;
        
        $recentSessionIds = TypingSession::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->pluck('id');

        $mistakes = keystrokeMistake::whereIn('typing_session_id', $recentSessionIds)->get();

        if ($mistakes->isEmpty()) {
            $focusLetters = "None yet";
        } else {
            $topMistakes = $mistakes->groupBy(function ($m) {
                $char = $m->expected_character;
                $char = ($char === null || trim($char) === '') ? 'Space' : $char;
                return strtoupper($char);
            })->sortByDesc(function ($group) {
                return $group->count();
            })->take(5)->keys()->implode(', ');

            $focusLetters = $topMistakes;
        }

        if ($requestsToday >= $dailyLimit) {
            $resetDateStr = $resetDateObj->format('F j, Y \a\t g:i A');

            return response()->json([
                'message' => "You have reached your limit of {$dailyLimit} AI questions. Your limit will reset on {$resetDateStr}.",
                'best_wpm' => $bestWpm,
                'avg_accuracy' => round($avgAccuracy, 2),
                'focus_letters' => $focusLetters,
                'remaining_requests' => 0
            ]);
        }

        $userQuestion = $request->input('question');
        
        $prompt = "You are an AI typing coach named LexiType. User Best WPM: {$bestWpm}, Accuracy: {$avgAccuracy}%. The user's most frequent typing mistakes are: {$focusLetters}. Keep answers short (1-3 sentences). IMPORTANT: Detect the user's language. If the user writes in English, reply in strict English. If the user writes in Tagalog, reply in strict Tagalog. Do not use Taglish unless the user explicitly asks you to do so.";
        
        if ($userQuestion) {
            $prompt .= " User question: '{$userQuestion}'. If the user asks about their mistakes or weaknesses, mention their weakest keys ({$focusLetters}) and provide a specific tip to improve them.";
        } else {
            $prompt .= " Give a short, encouraging typing tip focused on improving their weakest keys ({$focusLetters}).";
        }

        $apiKey = env('GEMINI_API_KEY');

        $aiMessage = "Keep practicing! I need more data to analyze your typing.";

        try {
            $modelUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
            
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
                
                Cache::put($cacheKey, [
                    'count' => $requestsToday + 1,
                    'reset_at' => $resetDateObj->toDateTimeString()
                ], $resetDateObj);

            } else {
                $status = $response->status();
                $body = $response->body();
                Log::error("Gemini API Error: status={$status} body={$body}");
                
                if ($status === 503) {
                    $aiMessage = "Masyadong maraming gumagamit sa AI coach ngayon. Pakisubukang muli pagkalipas ng ilang sandali.";
                } else {
                    $aiMessage = "You have reached your limit or there is an issue with the AI.";
                }
            }

        } catch (\Exception $e) {
            Log::error("System Error in AI: " . $e->getMessage(), ['exception' => $e]);
            $aiMessage = "Sorry, there was a system connection error. Please try again later.";
        }

        return response()->json([
            'message' => $aiMessage,
            'best_wpm' => $bestWpm,
            'avg_accuracy' => round($avgAccuracy, 2),
            'focus_letters' => $focusLetters,
            'remaining_requests' => $dailyLimit - ($requestsToday + 1)
        ]);
    }
}