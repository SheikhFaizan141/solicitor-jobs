<?php

namespace App\Console\Commands;

use App\Models\JobAlertSubscription;
use Illuminate\Console\Command;

class MigrateJobAlertPracticeAreas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'job-alerts:migrate-practice-areas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate practice_area_ids from JSON column to join table';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting migration of practice area IDs...');

        $migratedCount = 0;
        $skippedCount = 0;

        JobAlertSubscription::whereNotNull('practice_area_ids')
            ->chunkById(100, function ($subscriptions) use (&$migratedCount, &$skippedCount) {
                foreach ($subscriptions as $subscription) {
                    $practiceAreaIds = $subscription->practice_area_ids;

                    if (is_array($practiceAreaIds) && count($practiceAreaIds) > 0) {
                        // Sync to join table (won't duplicate existing entries)
                        $subscription->practiceAreas()->syncWithoutDetaching($practiceAreaIds);

                        $this->line("✓ Migrated subscription #{$subscription->id} ({$subscription->user->email}) - " . count($practiceAreaIds) . " practice areas");
                        $migratedCount++;
                    } else {
                        $skippedCount++;
                    }
                }
            });

        $this->newLine();
        $this->info("Migration completed!");
        $this->info("Migrated: {$migratedCount} subscriptions");
        $this->info("Skipped: {$skippedCount} subscriptions (no practice areas)");

        return self::SUCCESS;
    }
}
