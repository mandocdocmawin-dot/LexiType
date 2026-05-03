<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
            'isAdmin' => \App\Http\Middleware\IsAdmin::class,
        ]);

        $middleware->redirectUsersTo(fn () => match(strtolower(auth()->user()->role ?? '')) {
            'admin', 'administrator', 'moderator' => route('admin.overview', absolute: false),
            default => '/',
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
