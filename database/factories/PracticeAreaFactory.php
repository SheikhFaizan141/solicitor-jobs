<?php

namespace Database\Factories;

use App\Models\PracticeArea;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PracticeArea>
 */
class PracticeAreaFactory extends Factory
{
    protected $model = PracticeArea::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $practiceAreas = [
            'Corporate Law',
            'Family Law',
            'Criminal Law',
            'Employment Law',
            'Immigration Law',
            'Personal Injury',
            'Real Estate Law',
            'Intellectual Property',
            'Tax Law',
            'Commercial Litigation',
            'Banking & Finance',
            'Mergers & Acquisitions',
            'Environmental Law',
            'Healthcare Law',
            'Insurance Law',
            'Construction Law',
            'Media & Entertainment',
            'Sports Law',
            'Data Protection',
            'Human Rights',
        ];

        return [
            'name' => $this->faker->unique()->randomElement($practiceAreas),
        ];
    }
}
