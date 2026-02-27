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
        // Create roles first
        $this->call(RoleSeeder::class);

        // // Seed law firms, practice areas, reviews, and jobs
        $this->call([
            PracticeAreaSeeder::class,
            LawFirmSeeder::class,
            ReviewSeeder::class,
            LocationSeeder::class,
            JobListingSeeder::class,
        ]);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => bcrypt('password')]
        );
        $admin->syncRoles([User::ROLE_ADMIN]);

        // Create editor user
        $editor = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            ['name' => 'Editor', 'password' => bcrypt('password')]
        );
        $editor->syncRoles([User::ROLE_EDITOR]);
    }
}
