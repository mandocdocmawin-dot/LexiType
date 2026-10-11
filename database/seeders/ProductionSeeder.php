<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $email = getenv('ADMIN_EMAIL') ?: 'admin@lexitype.app';

        // Walang factory/faker dito, kaya gagana sa --no-dev
        if (! User::where('email', $email)->exists()) {
            User::forceCreate([
                'name' => 'Admin',
                'email' => $email,
                'password' => Hash::make(getenv('ADMIN_PASSWORD') ?: Str::random(32)),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]);
        }

        // May user na, kaya hindi na gagamit ng factory ang JSON seeder
        $this->call(SystemTypingTextJsonSeeder::class);
    }
}   