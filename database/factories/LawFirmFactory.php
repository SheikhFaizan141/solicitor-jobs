<?php

namespace Database\Factories;

use App\Models\LawFirm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LawFirm>
 */
class LawFirmFactory extends Factory
{
    protected $model = LawFirm::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firmTypes = ['LLP', 'Solicitors', '& Partners', '& Co', 'Legal', 'Law'];
        $name = $this->faker->lastName().' '.$this->faker->randomElement($firmTypes);

        return [
            'name' => $name,
            'description' => $this->faker->optional()->paragraphs(2, true),
            'excerpt' => $this->faker->optional()->sentence(15),
            'is_active' => true,
            'website' => $this->faker->optional()->url(),
        ];
    }

    /**
     * Mark the law firm as inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
