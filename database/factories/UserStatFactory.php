<?php

namespace Database\Factories;

use App\Models\UserStat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserStat>
 */
class UserStatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'average_wpm' => $this->faker->numberBetween(20, 250),
            'highest_wpm' => $this->faker->numberBetween(20, 250),
            'total_tests_taken' => $this->faker->numberBetween(0, 25),
        ];
    }
}
