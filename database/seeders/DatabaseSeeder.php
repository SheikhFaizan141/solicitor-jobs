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
        // Create additional test users for job postings
        // User::factory(15)->create();

        // // Seed law firms, practice areas, reviews, and jobs
        // $this->call([
        //     PracticeAreaSeeder::class,
        //     LawFirmSeeder::class,
        //     ReviewSeeder::class,
        //     // JobListingSeeder::class,
        // ]);

        \App\Models\User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => bcrypt('password'), 'role' => \App\Models\User::ROLE_ADMIN]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'editor@example.com'],
            ['name' => 'Editor', 'password' => bcrypt('password'), 'role' => \App\Models\User::ROLE_EDITOR]
        );
    }
}
