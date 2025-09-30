<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\User;
use App\Models\LawFirm;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Ensure we have users and law firms
        $users = User::all();
        $lawFirms = LawFirm::all();

        if ($users->isEmpty()) {
            // Create some test users if none exist
            $users = User::factory(15)->create();
        }

        if ($lawFirms->isEmpty()) {
            // Create some test law firms if none exist
            $lawFirms = collect([
                [
                    'name' => 'Smith & Associates',
                    'description' => 'Specializing in corporate law and business litigation.',
                    'email' => 'contact@smithlaw.com',
                    'location' => 'London, UK',
                    'phone' => '+44 20 1234 5678',
                ],
                [
                    'name' => 'Johnson Legal Partners',
                    'description' => 'Expert family law and divorce attorneys.',
                    'email' => 'info@johnsonlegal.com',
                    'location' => 'Manchester, UK',
                    'phone' => '+44 161 234 5678',
                ],
                [
                    'name' => 'Brown & Co Solicitors',
                    'description' => 'Criminal defense and personal injury specialists.',
                    'email' => 'help@brownco.com',
                    'location' => 'Birmingham, UK',
                    'phone' => '+44 121 234 5678',
                ],
                [
                    'name' => 'Williams Law Firm',
                    'description' => 'Real estate and property law experts.',
                    'email' => 'contact@williamslaw.com',
                    'location' => 'Edinburgh, UK',
                    'phone' => '+44 131 234 5678',
                ],
                [
                    'name' => 'Davis Legal Services',
                    'description' => 'Employment law and workplace discrimination.',
                    'email' => 'info@davislegal.com',
                    'location' => 'Cardiff, UK',
                    'phone' => '+44 29 1234 5678',
                ],
                [
                    'name' => 'Miller & Partners',
                    'description' => 'Immigration and visa law specialists.',
                    'email' => 'contact@millerpartners.com',
                    'location' => 'Bristol, UK',
                    'phone' => '+44 117 234 5678',
                ],
            ])->map(function ($data) {
                return LawFirm::create($data);
            });
        }

        // Refresh collections to get IDs
        $users = User::all();
        $lawFirms = LawFirm::all();

        // Sample review comments for different ratings
        $excellentComments = [
            'Outstanding service! The team was professional, knowledgeable, and achieved excellent results for my case.',
            'Exceeded all expectations. Highly recommend their expertise and dedication.',
            'Professional, efficient, and got the job done perfectly. Could not ask for better representation.',
            'Amazing experience from start to finish. They kept me informed throughout the entire process.',
            'Top-notch legal service. The team was responsive and delivered exceptional results.',
        ];

        $goodComments = [
            'Good service overall. The team was helpful and knowledgeable.',
            'Satisfied with the outcome. Professional staff and reasonable fees.',
            'Solid legal representation. Would use their services again.',
            'Good communication throughout the process. Happy with the results.',
            'Professional service with good attention to detail.',
        ];

        $averageComments = [
            'Service was okay. Nothing particularly outstanding but got the job done.',
            'Average experience. The team was professional but communication could be better.',
            'Decent service but felt it took longer than expected.',
            'Acceptable service for the price. Results were satisfactory.',
            'It was fine. Professional but not particularly impressive.',
        ];

        $poorComments = [
            'Service was below expectations. Communication was lacking.',
            'Disappointed with the outcome. Felt like the case was not given proper attention.',
            'Poor communication throughout the process. Would not recommend.',
            'Overpriced for the quality of service received.',
            'Had to follow up multiple times for updates. Not very responsive.',
        ];

        $terribleComments = [
            'Terrible experience. Unprofessional and poor results.',
            'Would not recommend. Poor communication and unsatisfactory outcome.',
            'Very disappointing service. Felt like a waste of time and money.',
            'Extremely unprofessional. Avoid at all costs.',
            'Worst legal experience I\'ve ever had. Completely unprofessional.',
        ];

        // Create 30-40 reviews with realistic distribution
        $totalReviews = $faker->numberBetween(30, 40);
        
        for ($i = 0; $i < $totalReviews; $i++) {
            // Weight ratings to be more realistic (more 4-5 star reviews)
            $ratingWeights = [1 => 5, 2 => 10, 3 => 15, 4 => 35, 5 => 35];
            $rating = $faker->randomElement(
                array_merge(
                    array_fill(0, $ratingWeights[1], 1),
                    array_fill(0, $ratingWeights[2], 2),
                    array_fill(0, $ratingWeights[3], 3),
                    array_fill(0, $ratingWeights[4], 4),
                    array_fill(0, $ratingWeights[5], 5)
                )
            );

            // Select appropriate comment based on rating
            $comment = match($rating) {
                5 => $faker->randomElement($excellentComments),
                4 => $faker->randomElement($goodComments),
                3 => $faker->randomElement($averageComments),
                2 => $faker->randomElement($poorComments),
                1 => $faker->randomElement($terribleComments),
            };

            // Determine status (most reviews should be active)
            $statusWeights = ['active' => 85, 'spam' => 10, 'trashed' => 5];
            $status = $faker->randomElement(
                array_merge(
                    array_fill(0, $statusWeights['active'], 'active'),
                    array_fill(0, $statusWeights['spam'], 'spam'),
                    array_fill(0, $statusWeights['trashed'], 'trashed')
                )
            );

            // Create the review
            $review = Review::create([
                'user_id' => $users->random()->id,
                'law_firm_id' => $lawFirms->random()->id,
                'rating' => $rating,
                'comment' => $comment,
                'status' => $status,
                'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
                'updated_at' => now(),
            ]);

            // If status is trashed, soft delete it
            if ($status === 'trashed') {
                $review->delete();
            }
        }

        $this->command->info("Created {$totalReviews} reviews with realistic distribution.");
        $this->command->info('Active: ' . Review::active()->count());
        $this->command->info('Spam: ' . Review::spam()->count());
        $this->command->info('Trashed: ' . Review::onlyTrashed()->count());
    }
}