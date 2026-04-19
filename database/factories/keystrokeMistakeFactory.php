<?php

namespace Database\Factories;

use App\Models\keystrokeMistake;
use App\Models\TypingSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<keystrokeMistake>
 */
class keystrokeMistakeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'typing_session_id' => TypingSession::factory(),
            'expected_character' => $this->faker->randomLetter(),
            'typed_char' => $this->faker->randomLetter(),
            'time_to_press_ms' => $this->faker->numberBetween(1, 1000),
        ];
    }
}
