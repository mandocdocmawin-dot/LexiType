<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();
        $role = strtolower($user->role ?? '');

        if (in_array($role, ['admin', 'administrator'])) {
            return $next($request);
        }

        // Return different response based on request type
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized. Admin access only.'], 403);
        }

        return redirect('/')->with('error', 'Unauthorized. Admin access only.');
    }
}