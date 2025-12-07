<?php

namespace Database\Factories;

use App\Models\JobListing;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobListing>
 */
class JobListingFactory extends Factory
{
    protected $model = JobListing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Job titles specific to legal sector
        $jobTitles = [
            'Senior Corporate Lawyer',
            'Family Law Solicitor',
            'Criminal Defense Attorney',
            'Commercial Property Lawyer',
            'Immigration Lawyer',
            'Intellectual Property Counsel',
            'Employment Law Specialist',
            'Personal Injury Solicitor',
            'Tax Law Advisor',
            'Litigation Associate',
            'In-House Counsel',
            'Legal Assistant',
            'Paralegal',
            'Junior Solicitor',
            'Senior Partner',
            'Contract Lawyer',
            'Mergers & Acquisitions Lawyer',
            'Banking & Finance Lawyer',
            'Real Estate Attorney',
            'Criminal Law Barrister',
            'Family Court Advocate',
            'Corporate Compliance Officer',
            'Legal Researcher',
            'Court Clerk',
            'Legal Secretary',
        ];

        // UK cities for job locations
        $ukLocations = [
            'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
            'Sheffield', 'Bradford', 'Liverpool', 'Edinburgh', 'Bristol',
            'Cardiff', 'Leicester', 'Coventry', 'Belfast', 'Nottingham',
            'Newcastle', 'Brighton', 'Hull', 'Plymouth', 'Stoke-on-Trent',
            'Remote', 'Hybrid - London', 'Hybrid - Manchester',
        ];

        // Experience levels
        $experienceLevels = [
            'Entry Level',
            '1-2 years',
            '2-4 years',
            '3-5 years',
            '4-6 years',
            '5+ years',
            '7+ years',
            '10+ years',
            'Senior Level',
            'Partner Level',
        ];

        // Generate salary range
        $salaryMin = $this->faker->numberBetween(25000, 150000);
        $salaryMax = $salaryMin + $this->faker->numberBetween(10000, 50000);

        // Job descriptions
        $descriptions = [
            'Join our dynamic legal team and work on challenging cases that make a real difference. We offer excellent career progression opportunities and a supportive work environment.',
            'We are seeking an experienced legal professional to handle complex matters and provide strategic advice to our diverse client base.',
            'Exciting opportunity to work with a leading law firm on high-profile cases. Excellent benefits and professional development opportunities available.',
            'Work alongside industry experts in a collaborative environment. This role offers the chance to develop your skills while working on cutting-edge legal matters.',
            'Join our award-winning team and take your legal career to the next level. We offer competitive compensation and a clear path for advancement.',
        ];

        // Requirements arrays
        $requirements = [
            [
                'Qualified solicitor with valid practicing certificate',
                'Strong analytical and research skills',
                'Excellent written and verbal communication',
                'Ability to work under pressure and meet deadlines',
                'Experience with case management systems',
            ],
            [
                'Law degree from recognized institution',
                'Minimum 3 years relevant experience',
                'Strong attention to detail',
                'Client-focused approach',
                'Proficiency in legal research databases',
            ],
            [
                'Admitted to practice law in England and Wales',
                'Experience in relevant practice area',
                'Strong negotiation skills',
                'Ability to manage multiple cases simultaneously',
                'Knowledge of current legal procedures and regulations',
            ],
        ];

        // Benefits arrays
        $benefits = [
            [
                'Competitive salary with annual reviews',
                'Comprehensive health and dental insurance',
                'Generous pension scheme',
                '25 days annual leave plus bank holidays',
                'Professional development budget',
                'Flexible working arrangements',
            ],
            [
                'Performance-based bonuses',
                'Life insurance coverage',
                'Season ticket loans',
                'On-site gym facilities',
                'Mentorship programs',
                'Career progression opportunities',
            ],
            [
                'Private healthcare',
                'Sabbatical opportunities',
                'Continuing education support',
                'Technology allowance',
                'Social events and team building',
                'Parking or transport allowance',
            ],
        ];

        $isActive = $this->faker->boolean(85); // 85% chance of being active
        $publishedAt = $isActive ? $this->faker->dateTimeBetween('-3 months', 'now') : null;

        return [
            'title' => $this->faker->randomElement($jobTitles),
            'law_firm_id' => null, // Will be set in seeder
            // 'location' => $this->faker->randomElement($ukLocations),
            'location_id' => Location::inRandomOrder()->first()?->id,
            'workplace_type' => $this->faker->randomElement(['onsite', 'remote', 'hybrid']),
            'employment_type' => $this->faker->randomElement(['full_time', 'part_time', 'contract', 'internship']),
            'experience_level' => $this->faker->randomElement($experienceLevels),
            'salary_min' => $salaryMin,
            'salary_max' => $salaryMax,
            'salary_currency' => 'GBP',
            'closing_date' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('now', '+3 months') : null,
            'is_active' => $isActive,
            'description' => $this->faker->randomElement($descriptions)."\n\n".$this->faker->paragraphs(2, true),
            'requirements' => $this->faker->randomElement($requirements),
            'benefits' => $this->faker->randomElement($benefits),
            'posted_by' => null, // Will be set in seeder
            'published_at' => $publishedAt,
            'created_at' => $publishedAt ?? $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    /**
     * Indicate that the job listing is active
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'published_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
        ]);
    }

    /**
     * Indicate that the job listing is inactive
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the job listing is for a senior position
     */
    public function senior(): static
    {
        return $this->state(fn (array $attributes) => [
            'experience_level' => $this->faker->randomElement(['5+ years', '7+ years', '10+ years', 'Senior Level', 'Partner Level']),
            'salary_min' => $this->faker->numberBetween(80000, 200000),
            'salary_max' => fn (array $attributes) => $attributes['salary_min'] + $this->faker->numberBetween(20000, 100000),
        ]);
    }

    /**
     * Indicate that the job listing is for a junior position
     */
    public function junior(): static
    {
        return $this->state(fn (array $attributes) => [
            'experience_level' => $this->faker->randomElement(['Entry Level', '1-2 years', '2-4 years']),
            'salary_min' => $this->faker->numberBetween(25000, 50000),
            'salary_max' => fn (array $attributes) => $attributes['salary_min'] + $this->faker->numberBetween(5000, 20000),
        ]);
    }
}
