<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\SystemTypingText;
use App\Models\User;

class SystemTypingTextJsonSeeder extends Seeder
{
    public function run()
    {
        $path = database_path('seeders/data/system_typing_texts.json');
        if (!File::exists($path)) {
            $this->command->info("JSON file not found: $path");
            return;
        }

        $data = json_decode(File::get($path), true);
        if (empty($data)) {
            $this->command->info("No data in JSON file.");
            return;
        }

        // Use first existing user or create a simple system user
        $user = User::first();
        if (!$user) {
            // Use factory if available, otherwise create directly
            if (method_exists(User::class, 'factory')) {
                $user = User::factory()->create([
                    'name' => 'System',
                    'email' => 'system@local.test',
                ]);
            } else {
                $user = User::create([
                    'name' => 'System',
                    'email' => 'system@local.test',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]);
            }
        }

        foreach ($data as $item) {
            $exists = SystemTypingText::where('category', $item['category'])
                ->where('difficulty_level', $item['difficulty_level'])
                ->where('content', $item['content'])
                ->exists();

            if (!$exists) {
                SystemTypingText::create([
                    'user_id' => $user->id,
                    'category' => $item['category'],
                    'content' => $item['content'],
                    'difficulty_level' => $item['difficulty_level'],
                    'is_active' => $item['is_active'] ?? true,
                ]);
            }
        }
    }
}
