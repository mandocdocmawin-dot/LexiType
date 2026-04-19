<?php

namespace Database\Factories;

use App\Models\SystemTypingText;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SystemTypingText>
 */
class SystemTypingTextFactory extends Factory
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
            'category' => $this->faker->randomElement(['code_snippets', 'quotes', 'paragraphs']),
            'content' => $this->faker->paragraph(),
            'difficulty_level' => $this->faker->randomElement([30, 60, 120]),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
