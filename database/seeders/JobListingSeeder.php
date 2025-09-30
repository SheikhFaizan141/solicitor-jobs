<?php

namespace Database\Seeders;

use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\PracticeArea;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating job listings...');

        // Ensure we have law firms and practice areas
        $lawFirms = LawFirm::all();
        $practiceAreas = PracticeArea::all();
        $users = User::all();

        if ($lawFirms->isEmpty()) {
            $this->command->warn('No law firms found. Please run LawFirmSeeder first.');
            return;
        }

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Creating some test users...');
            User::factory(5)->create();
            $users = User::all();
        }

        // Create 100 job listings with different distributions
        $this->command->info('Creating 100 job listings...');

        // 70 active jobs posted by existing law firms
        JobListing::factory()
            ->count(70)
            ->active()
            ->create()
            ->each(function (JobListing $job) use ($lawFirms, $practiceAreas, $users) {
                // Assign to existing law firm
                $job->update([
                    'law_firm_id' => $lawFirms->random()->id,
                    'posted_by' => $users->random()->id,
                ]);

                // Attach 1-3 random practice areas
                if ($practiceAreas->isNotEmpty()) {
                    $numAreas = rand(1, 3);
                    $selectedAreas = $practiceAreas->random($numAreas);
                    $job->practiceAreas()->attach($selectedAreas->pluck('id'));
                }
            });

        // 15 senior-level positions
        JobListing::factory()
            ->count(15)
            ->senior()
            ->active()
            ->create()
            ->each(function (JobListing $job) use ($lawFirms, $practiceAreas, $users) {
                $job->update([
                    'law_firm_id' => $lawFirms->random()->id,
                    'posted_by' => $users->random()->id,
                ]);

                if ($practiceAreas->isNotEmpty()) {
                    $numAreas = rand(1, 2);
                    $selectedAreas = $practiceAreas->random($numAreas);
                    $job->practiceAreas()->attach($selectedAreas->pluck('id'));
                }
            });

        // 10 junior-level positions
        JobListing::factory()
            ->count(10)
            ->junior()
            ->active()
            ->create()
            ->each(function (JobListing $job) use ($lawFirms, $practiceAreas, $users) {
                $job->update([
                    'law_firm_id' => $lawFirms->random()->id,
                    'posted_by' => $users->random()->id,
                ]);

                if ($practiceAreas->isNotEmpty()) {
                    $numAreas = rand(1, 4);
                    $selectedAreas = $practiceAreas->random($numAreas);
                    $job->practiceAreas()->attach($selectedAreas->pluck('id'));
                }
            });

        // 5 inactive/draft jobs
        JobListing::factory()
            ->count(5)
            ->inactive()
            ->create()
            ->each(function (JobListing $job) use ($lawFirms, $practiceAreas, $users) {
                $job->update([
                    'law_firm_id' => $lawFirms->random()->id,
                    'posted_by' => $users->random()->id,
                ]);

                if ($practiceAreas->isNotEmpty()) {
                    $numAreas = rand(1, 2);
                    $selectedAreas = $practiceAreas->random($numAreas);
                    $job->practiceAreas()->attach($selectedAreas->pluck('id'));
                }
            });

        $this->command->info('Created ' . JobListing::count() . ' job listings successfully!');
        $this->command->info('Active jobs: ' . JobListing::where('is_active', true)->count());
        $this->command->info('Inactive jobs: ' . JobListing::where('is_active', false)->count());
    }
}