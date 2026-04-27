<?php

namespace Database\Seeders;

use App\Models\SystemTypingText;
use App\Models\User;
use App\Models\keystrokeMistake; 
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Gagawa tayo ng 1 Specific Test User

        User::factory()->create([
            'name' => 'Admin Boss',
            'email' => 'admin@test.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Regular Juan',
            'email' => 'user@test.com',
            'password' => Hash::make('user123'),
            'role' => 'user', 
        ]);

        // // 2. Gagawa tayo ng 5 Random Users kasama ang LAHAT ng related data nila!
        User::factory(5)
        //     ->hasProfile()              // Gagawa ng 1 UserProfile
        //     ->hasStats()                // Gagawa ng 1 UserStat
            ->hasTypingSessions(3)      // Gagawa ng 3 TypingSessions
            // ->hasFeedbacks(2)           // Gagawa ng 2 UserFeedbacks
        //     ->hasCustomExercises(2)     // Gagawa ng 2 CustomExercises
        //     ->hasAiRecommendations(2)   // Gagawa ng 2 AIRecommendations
            ->create();

        // 3. System Typing Texts — use JSON seeder for deterministic content
        // If you prefer the old random factory data, uncomment the factory line below.
        $this->call(SystemTypingTextJsonSeeder::class);
        // SystemTypingText::factory(5)->create();

        // // 4. Keystroke Mistakes 
        // // (Pansamantala lang: Gagawa ng 10 random mistakes)
        // keystrokeMistake::factory(10)->create();
    }
}