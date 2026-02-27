<?php

namespace App\Services;

use App\Data\RankedJob;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use App\Models\User;
use App\Models\UserJobInteraction;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class JobAlertRecommendationService
{
    /**
     * @param Collection<int, JobListing> $jobs
     * @return Collection<int, RankedJob>
     */
    public function rank(JobAlertSubscription $subscription, Collection $jobs, User $user): Collection
    {
        $practiceAreaIds = $subscription->practiceAreas->pluck('id')->all();
        $employmentTypes = $subscription->employment_types ?? [];
        $keyword = filled($subscription->keyword) ? Str::lower($subscription->keyword) : null;
        $experienceLevel = $subscription->experience_level;

        $priorFirmIds = $user->jobInteractions()
            ->whereIn('type', [UserJobInteraction::TYPE_SAVED, UserJobInteraction::TYPE_APPLIED])
            ->with('jobListing:id,law_firm_id')
            ->get()
            ->pluck('jobListing.law_firm_id')
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $jobs
            ->map(function (JobListing $job) use ($practiceAreaIds, $employmentTypes, $keyword, $experienceLevel, $subscription, $priorFirmIds): RankedJob {
                $score = 0.0;
                $reasons = [];

                if (! empty($practiceAreaIds) && $job->practiceAreas->pluck('id')->intersect($practiceAreaIds)->isNotEmpty()) {
                    $score += 35;
                    $reasons[] = 'practice_area_match';
                }

                if ($subscription->location_id && $subscription->location_id === $job->location_id) {
                    $score += 20;
                    $reasons[] = 'location_match';
                }

                if (! empty($employmentTypes) && in_array($job->employment_type, $employmentTypes, true)) {
                    $score += 15;
                    $reasons[] = 'employment_type_match';
                }

                if ($keyword && Str::contains(Str::lower($job->title), $keyword)) {
                    $score += 20;
                    $reasons[] = 'keyword_match';
                }

                if (filled($experienceLevel) && $experienceLevel === $job->experience_level) {
                    $score += 10;
                    $reasons[] = 'experience_level_match';
                }

                if ($job->law_firm_id && in_array($job->law_firm_id, $priorFirmIds, true)) {
                    $score += 8;
                    $reasons[] = 'familiar_law_firm';
                }

                $publishedTimestamp = optional($job->published_at)->timestamp;
                $ageInDays = $publishedTimestamp
                    ? (int) max(0, floor((now()->timestamp - $publishedTimestamp) / 86400))
                    : 30;
                $recencyBonus = (float) max(0, 12 - min(12, $ageInDays));
                if ($recencyBonus > 0) {
                    $score += $recencyBonus;
                    $reasons[] = 'recent_posting';
                }

                $reasonCodes = array_values(array_unique($reasons));

                return new RankedJob(
                    job: $job,
                    score: round($score, 2),
                    reasonCodes: $reasonCodes,
                    reasonLabels: $this->reasonLabels($reasonCodes),
                );
            })
            ->sort(function (RankedJob $a, RankedJob $b): int {
                $scoreCompare = $b->score <=> $a->score;
                if ($scoreCompare !== 0) {
                    return $scoreCompare;
                }

                $aTimestamp = optional($a->job->published_at)->timestamp ?? 0;
                $bTimestamp = optional($b->job->published_at)->timestamp ?? 0;

                return $bTimestamp <=> $aTimestamp;
            })
            ->values();
    }

    /**
     * @param list<string> $reasonCodes
     * @return list<string>
     */
    private function reasonLabels(array $reasonCodes): array
    {
        $labels = [
            'practice_area_match' => 'Practice area match',
            'location_match' => 'Preferred location',
            'employment_type_match' => 'Employment type match',
            'keyword_match' => 'Keyword in title',
            'experience_level_match' => 'Same experience level',
            'familiar_law_firm' => 'Similar to firms you engaged with',
            'recent_posting' => 'Recent posting',
        ];

        return array_values(array_map(
            fn (string $code): string => $labels[$code] ?? Str::headline(str_replace('_', ' ', $code)),
            $reasonCodes,
        ));
    }
}
