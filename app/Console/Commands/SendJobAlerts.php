<?php

namespace App\Console\Commands;

use App\Mail\JobAlertDigestMail;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendJobAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alerts:send {frequency? : daily|weekly}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send job alert digest to subscribers';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $frequencies = ['daily', 'weekly'];
        $arg = $this->argument('frequency');
        if ($arg) {
            if (! in_array($arg, $frequencies)) {
                $this->error('Invalid frequency. Allowed values are: daily, weekly.');

                return self::FAILURE;
                // TODO
            }
            $frequencies = [$arg];
        }

        foreach ($frequencies as $freq) {
            $since = $freq === 'daily' ? now()->subDay() : now()->subWeek();
            
            JobAlertSubscription::query()
                ->where('is_active', true)
                ->where('frequency', $freq)
                ->with('user')
                ->chunkById(200, function ($subs) use ($since) {
                    foreach ($subs as $sub) {
                        $user = $sub->user;
                        // Respect user-level prefs (must exist, allow emails, allow job alerts)
                        if (! $user || ! $user->email_notifications || ! $user->job_alerts) {
                            continue;
                        }

                        $jobs = JobListing::query()
                            ->active()
                            ->published()
                            ->with('lawFirm')
                            ->when($sub->employment_types && count($sub->employment_types) > 0, fn ($q) => $q->whereIn('employment_type', $sub->employment_types)
                            )
                            ->when($sub->practice_area_ids && count($sub->practice_area_ids) > 0, fn ($q) => $q->whereHas('practiceAreas', fn ($qq) => $qq->whereIn('practice_areas.id', $sub->practice_area_ids))
                            )
                            // ->when($sub->location, fn ($q) => $q->where('location', $sub->location)
                            // )
                            ->where('published_at', '>=', $since)
                            ->latest('published_at')
                            ->limit(50)
                            ->get();

                        if ($jobs->isNotEmpty()) {
                            // Queue the email to the user's email
                            Mail::to($user->email)->queue(new JobAlertDigestMail($sub, $jobs));
                            $sub->forceFill(['last_sent_at' => now()])->save();
                        }
                    }
                });

            $this->info("processed {$freq} alerts.");
        }

        return self::SUCCESS;
    }
}
