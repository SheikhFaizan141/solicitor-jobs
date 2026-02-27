<?php

namespace App\Console\Commands;

use App\Data\RankedJob;
use App\Mail\JobAlertDigestMail;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use App\Models\User;
use App\Services\JobAlertRecommendationService;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Throwable;

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

    public function __construct(private readonly JobAlertRecommendationService $recommendationService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $frequencies = ['daily', 'weekly'];
        $arg = $this->argument('frequency');
        if ($arg) {
            if (! in_array($arg, $frequencies, true)) {
                $this->error('Invalid frequency. Allowed values are: daily, weekly.');
                return self::FAILURE;
            }
            $frequencies = [$arg];
        }

        foreach ($frequencies as $freq) {
            $since = $freq === 'daily' ? now()->subDay() : now()->subWeek();

            JobAlertSubscription::query()
                ->where('is_active', true)
                ->where('frequency', $freq)
                ->with(['user', 'practiceAreas', 'location'])
                ->chunkById(200, function (Collection $subs) use ($since) {
                    foreach ($subs as $sub) {
                        $user = $sub->user;

                        if (! $user || ! $user->email_notifications || ! $user->job_alerts) {
                            continue;
                        }

                        $jobs = JobListing::query()
                            ->active()
                            ->published()
                            ->with(['lawFirm', 'location', 'practiceAreas'])
                            ->when(
                                $sub->employment_types && count($sub->employment_types) > 0,
                                fn ($q) => $q->whereIn('employment_type', $sub->employment_types)
                            )
                            ->when(
                                $sub->practiceAreas->isNotEmpty(),
                                fn ($q) => $q->whereHas('practiceAreas', fn ($qq) => $qq->whereIn('practice_areas.id', $sub->practiceAreas->pluck('id')))
                            )
                            ->when(
                                $sub->location_id,
                                fn ($q) => $q->where('location_id', $sub->location_id)
                            )
                            ->when(
                                filled($sub->keyword),
                                fn ($q) => $q->where('title', 'like', '%'.$sub->keyword.'%')
                            )
                            ->when(
                                filled($sub->experience_level),
                                fn ($q) => $q->where('experience_level', $sub->experience_level)
                            )
                            ->where('published_at', '>=', $since)
                            ->latest('published_at')
                            ->limit(50)
                            ->get();

                        if ($jobs->isEmpty()) {
                            continue;
                        }

                        $isPersonalized = $this->shouldUsePersonalizedRanking($user);
                        $rankedJobs = $isPersonalized
                            ? $this->recommendationService->rank($sub, $jobs, $user)
                            : $this->baselineRank($jobs);

                        $selectedJobs = $rankedJobs
                            ->take(max(config('smart-alerts.max_jobs_per_digest', 12), 1))
                            ->values();

                        if ($selectedJobs->isEmpty()) {
                            continue;
                        }

                        $deliveredAt = now();
                        $deliveryItems = $sub->deliveryItems()->createMany(
                            $selectedJobs->map(function (RankedJob $ranked, int $index) use ($user, $deliveredAt, $isPersonalized): array {
                                return [
                                    'user_id' => $user->id,
                                    'job_listing_id' => $ranked->job->id,
                                    'delivered_at' => $deliveredAt,
                                    'rank_position' => $index + 1,
                                    'score' => $ranked->score,
                                    'reason_codes' => $ranked->reasonCodes,
                                    'is_personalized' => $isPersonalized,
                                ];
                            })->all()
                        );

                        $clickUrlExpiresAt = now()->addDays(max(config('smart-alerts.click_link_ttl_days', 30), 1));
                        $jobsForMail = $selectedJobs
                            ->values()
                            ->map(function (RankedJob $ranked, int $index) use ($deliveryItems, $clickUrlExpiresAt): array {
                                $deliveryItem = $deliveryItems[$index];

                                return [
                                    'job' => $ranked->job,
                                    'rank_position' => $deliveryItem->rank_position,
                                    'score' => $ranked->score,
                                    'reason_codes' => $ranked->reasonCodes,
                                    'reason_labels' => $ranked->reasonLabels,
                                    'click_url' => URL::temporarySignedRoute('job-alert.click', $clickUrlExpiresAt, ['deliveryItem' => $deliveryItem->id]),
                                ];
                            });

                        try {
                            Mail::to($user->email)->queue(new JobAlertDigestMail($sub, $jobsForMail));

                            $sub->forceFill([
                                'last_sent_at' => now(),
                                'sent_count' => $sub->sent_count + 1,
                            ])->save();
                        } catch (Throwable) {
                            $sub->forceFill([
                                'failed_count' => $sub->failed_count + 1,
                            ])->save();
                        }
                    }
                });

            $this->info("processed {$freq} alerts.");
        }

        return self::SUCCESS;
    }

    private function shouldUsePersonalizedRanking(User $user): bool
    {
        if (! config('smart-alerts.enabled', true)) {
            return false;
        }

        $rollout = (int) config('smart-alerts.rollout_percentage', 100);
        $rollout = max(0, min($rollout, 100));

        if ($rollout === 100) {
            return true;
        }

        if ($rollout === 0) {
            return false;
        }

        return ($user->id % 100) < $rollout;
    }

    /**
     * @param Collection<int, JobListing> $jobs
     * @return Collection<int, RankedJob>
     */
    private function baselineRank(Collection $jobs): Collection
    {
        return $jobs
            ->sortByDesc('published_at')
            ->values()
            ->map(function (JobListing $job): RankedJob {
                $publishedTimestamp = optional($job->published_at)->timestamp;
                $ageInDays = $publishedTimestamp
                    ? (int) max(0, floor((now()->timestamp - $publishedTimestamp) / 86400))
                    : 30;
                $recencyBonus = (float) max(0, 12 - min(12, $ageInDays));

                return new RankedJob(
                    job: $job,
                    score: round($recencyBonus, 2),
                    reasonCodes: ['recent_posting'],
                    reasonLabels: ['Recent posting'],
                );
            });
    }
}
