<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create additional test users for job postings
        User::factory(15)->create();

        // Seed law firms, practice areas, reviews, and jobs
        $this->call([
            PracticeAreaSeeder::class,
            LawFirmSeeder::class,
            ReviewSeeder::class,
            JobListingSeeder::class,
        ]);
    }
}
