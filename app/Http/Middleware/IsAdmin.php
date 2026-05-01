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
        $role = strtolower(Auth::user()?->role ?? '');

        if (Auth::check() && in_array($role, ['admin', 'administrator'])) {
            return $next($request);
        }

        // Redirect non-admins to home with a message instead of a JSON error
        return redirect('/')->with('error', 'Unauthorized. Admin access only.');
    }
}