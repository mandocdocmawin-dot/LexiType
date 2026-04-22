<?php

namespace Database\Factories;

use App\Models\SystemTypingText;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SystemTypingTextFactory extends Factory
{
    public function definition(): array
    {
        $category = $this->faker->randomElement(['code_snippets', 'quotes', 'paragraphs']);
        $difficulty = $this->faker->randomElement(['easy', 'medium', 'hard']);

        return [
            'user_id'          => User::factory(),
            'category'         => $category,
            'content'          => $this->generateContent($category, $difficulty),
            'difficulty_level' => $difficulty,
            'is_active'        => true,
        ];
    }

    /**
     * Gagawa ng makatotohanang text depende sa category at difficulty.
     */
    private function generateContent($category, $difficulty): string
    {
        if ($category === 'code_snippets') {
            if ($difficulty === 'easy') return "const name = 'LexiType';\nconsole.log(name);";
            if ($difficulty === 'medium') return "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 10));";
            if ($difficulty === 'hard') return "const fetchData = async () => {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n};";
        }

        if ($category === 'quotes') {
            if ($difficulty === 'easy') return "Never give up on your dreams.";
            if ($difficulty === 'medium') return "Success is not final, failure is not fatal: it is the courage to continue that counts.";
            if ($difficulty === 'hard') return "The intuitive mind is a sacred gift and the rational mind is a faithful servant. We have created a society that honors the servant and has forgotten the gift. - Albert Einstein";
        }

        // Paragraphs
        if ($difficulty === 'easy') return $this->faker->text(50); // Maikli
        if ($difficulty === 'medium') return $this->faker->text(150); // Katamtaman
        return $this->faker->text(300); // Mahaba at mahirap
    }
}