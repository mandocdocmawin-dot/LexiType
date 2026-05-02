<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\UserFeedback;
use App\Policies\UserFeedbackPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // I-link ang Model sa Policy
        Gate::policy(UserFeedback::class, UserFeedbackPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}