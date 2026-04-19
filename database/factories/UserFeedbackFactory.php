<?php

namespace Database\Factories;

use App\Models\UserFeedback;
// use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserFeedback>
 */
class UserFeedbackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'user_id' => \App\Models\User::factory(),
            'message' => $this->faker->paragraph(),
        ];
    }
}
