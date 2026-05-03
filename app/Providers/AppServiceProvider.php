<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\SystemTypingText;
use App\Policies\SystemTypingTextPolicy;
use App\Policies\UserPolicy;

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

        // ── Policy registration ──
        Gate::policy(SystemTypingText::class, SystemTypingTextPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        // ── Gate definitions ──
        // Only admin or moderator can access the admin panel
        Gate::define('access-admin-panel', function (User $user) {
            return $user->isAdminOrModerator();
        });

        // Only admin can manage users (create, update, suspend, reset-password)
        Gate::define('manage-users', function (User $user) {
            return $user->isAdmin();
        });

        // Admin or moderator can manage exercises
        Gate::define('manage-exercises', function (User $user) {
            return $user->isAdminOrModerator();
        });

        // Only admin can delete users
        Gate::define('delete-user', function (User $user) {
            return $user->isAdmin();
        });
    }
}
