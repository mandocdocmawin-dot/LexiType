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
            $focusLetters = $mistakes->groupBy(function ($m) {
                $char = $m->expected_character;
                return strtoupper(($char === null || trim($char) === '') ? 'Space' : $char);
            })->sortByDesc(fn($group) => $group->count())->take(5)->keys()->implode(', ');
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
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiMessage = $data['candidates'][0]['content']['parts'][0]['text'] ?? $aiMessage;
                
                Cache::put($cacheKey, [
                    'count' => $requestsToday + 1,
                    'reset_at' => $resetDateObj->toDateTimeString()
                ], $resetDateObj);

                // --- RECOVERY MECHANISM: Persistently overwrite back to Healthy ---
                Cache::forever('system_health_ai_api', 'Healthy: Load balancing optimal. All sub-modules reporting normal parameters.');

            } else {
                $status = $response->status();
                $body = $response->body();
                Log::error("Gemini API Error: status={$status} body={$body}");
                
                // --- DYNAMIC & PERSISTENT ERROR HANDLING ---
                if ($status === 429) {
                    $retrySeconds = 86400; 
                    if (preg_match('/Please retry in ([\d\.]+)s/i', $body, $matches)) {
                        $retrySeconds = (int) ceil((float) $matches[1]);
                    }
                    $humanTime = now()->addSeconds($retrySeconds)->diffForHumans();
                    $aiMessage = "The AI coach is currently taking a break due to global request limits. Please try again {$humanTime}.";
                    
                    // Cache forever instead of using a specific expiration time
                    Cache::forever('system_health_ai_api', "Critical: API Quota Exceeded (429). Retrying {$humanTime}.");

                } elseif ($status === 503) {
                    $aiMessage = "Masyadong maraming gumagamit sa AI coach ngayon. Pakisubukang muli pagkalipas ng ilang sandali.";
                    Cache::forever('system_health_ai_api', "Warning: AI Service is currently overloaded (503).");
                } else {
                    $aiMessage = "You have reached your limit or there is an issue with the AI.";
                    
                    // Attempt to extract Google's specific error message dynamically
                    $decodedBody = json_decode($body);
                    $dynamicErrorMsg = $decodedBody->error->message ?? "Unknown error occurred.";
                    
                    Cache::forever('system_health_ai_api', "Error: AI Service Unavailable (Status {$status}) - {$dynamicErrorMsg}");
                }
            }

        } catch (\Exception $e) {
            Log::error("System Error in AI: " . $e->getMessage(), ['exception' => $e]);
            $aiMessage = "Sorry, there was a system connection error. Please try again later.";
            
            // Dynamically capture the Exception message and cache forever
            Cache::forever('system_health_ai_api', "Critical: System connection exception - " . $e->getMessage());
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