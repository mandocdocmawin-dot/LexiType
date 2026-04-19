<?php

namespace Database\Factories;

use App\Models\TypingSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TypingSession>
 */
class TypingSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'wpm_score' => $this->faker->numberBetween(20, 250),
            'accuracy_percentage' => $this->faker->numberBetween(80, 100),
            'duration_seconds' => $this->faker->randomElement([30, 60, 120]),
            'difficulty_played' => $this->faker->randomElement(['easy', 'medium', 'hard']),
        ];
    }
}
