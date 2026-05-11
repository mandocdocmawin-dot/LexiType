<?php

namespace App\Providers;

use App\Models\User;
use App\Models\UserFeedback;
use App\Models\SystemTypingText;
use App\Policies\UserPolicy;
use App\Policies\UserFeedbackPolicy;
use App\Policies\SystemTypingTextPolicy;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(UserFeedback::class, UserFeedbackPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(SystemTypingText::class, SystemTypingTextPolicy::class);

        // if (DB::getDriverName() === 'sqlite') {
        //     $path = DB::getConfig('database');
        //     if ($path && $path !== ':memory:' && ! file_exists($path)) {
        //         touch($path);
        //     }
        // }

        // if (! app()->runningInConsole() && ! Schema::hasTable('users')) {
        //     Artisan::call('migrate', ['--force' => true]);
        // }
    }
}