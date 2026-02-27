<?php

use App\Mail\JobAlertDigestMail;
use App\Models\JobAlertDeliveryItem;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\Location;
use App\Models\PracticeArea;
use App\Models\User;
use App\Models\UserJobInteraction;
use App\Services\JobAlertRecommendationService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

function createTestLocation(string $name = 'London'): Location
{
    return Location::query()->create([
        'name' => $name,
        'slug' => \Illuminate\Support\Str::slug($name),
        'region' => 'Greater London',
        'country' => 'UK',
        'is_remote' => false,
        'is_active' => true,
        'job_count' => 0,
    ]);
}

it('creates ranked delivery items and signed click urls when sending alerts', function () {
    config()->set('smart-alerts.enabled', true);
    config()->set('smart-alerts.rollout_percentage', 100);

    Mail::fake();

    $user = User::factory()->create();
    $location = createTestLocation();
    $practiceArea = PracticeArea::query()->create(['name' => 'Corporate Law']);
    $preferredFirm = LawFirm::factory()->create();
    $otherFirm = LawFirm::factory()->create();

    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'location_id' => $location->id,
        'employment_types' => ['full_time'],
        'is_active' => true,
    ]);
    $subscription->practiceAreas()->sync([$practiceArea->id]);

    $historyJob = JobListing::factory()->create([
        'law_firm_id' => $preferredFirm->id,
        'location_id' => $location->id,
        'employment_type' => 'full_time',
        'is_active' => true,
        'published_at' => now()->subDays(5),
    ]);
    $historyJob->practiceAreas()->sync([$practiceArea->id]);

    UserJobInteraction::query()->create([
        'user_id' => $user->id,
        'job_listing_id' => $historyJob->id,
        'type' => UserJobInteraction::TYPE_SAVED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
    ]);

    $highRankJob = JobListing::factory()->create([
        'title' => 'Corporate Associate',
        'law_firm_id' => $preferredFirm->id,
        'location_id' => $location->id,
        'employment_type' => 'full_time',
        'experience_level' => 'Senior Level',
        'is_active' => true,
        'published_at' => now()->subHours(2),
    ]);
    $highRankJob->practiceAreas()->sync([$practiceArea->id]);

    $lowerRankJob = JobListing::factory()->create([
        'title' => 'Corporate Associate II',
        'law_firm_id' => $otherFirm->id,
        'location_id' => $location->id,
        'employment_type' => 'full_time',
        'experience_level' => 'Senior Level',
        'is_active' => true,
        'published_at' => now()->subHours(2),
    ]);
    $lowerRankJob->practiceAreas()->sync([$practiceArea->id]);

    Artisan::call('alerts:send', ['frequency' => 'daily']);

    $items = JobAlertDeliveryItem::query()
        ->where('job_alert_subscription_id', $subscription->id)
        ->orderBy('rank_position')
        ->get();

    expect($items)->toHaveCount(2);
    expect($items->first()->job_listing_id)->toBe($highRankJob->id);
    expect($items->first()->reason_codes)->toContain('familiar_law_firm');

    Mail::assertQueued(JobAlertDigestMail::class, function (JobAlertDigestMail $mail) use ($subscription, $user) {
        return $mail->hasTo($user->email)
            && $mail->subscription->is($subscription)
            && $mail->jobs->count() === 2
            && $mail->jobs->first()['rank_position'] === 1
            && str_contains($mail->jobs->first()['click_url'], 'signature=');
    });
});

it('falls back to recency ordering when user has no interaction history', function () {
    $user = User::factory()->create();
    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'is_active' => true,
    ]);

    $older = new JobListing([
        'id' => 1,
        'title' => 'Older Job',
        'published_at' => now()->subDays(5),
        'employment_type' => 'full_time',
    ]);
    $older->setRelation('practiceAreas', collect());

    $newer = new JobListing([
        'id' => 2,
        'title' => 'Newer Job',
        'published_at' => now()->subDay(),
        'employment_type' => 'full_time',
    ]);
    $newer->setRelation('practiceAreas', collect());

    $jobs = collect([$older, $newer]);

    $ranked = app(JobAlertRecommendationService::class)->rank($subscription, $jobs, $user);

    expect($ranked->first()->job->title)->toBe('Newer Job');
});

it('rejects unsigned job alert click links', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['is_active' => true]);
    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'is_active' => true,
    ]);

    $deliveryItem = JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now(),
        'rank_position' => 1,
        'score' => 50,
        'reason_codes' => ['recent_posting'],
    ]);

    $this->get(route('job-alert.click', ['deliveryItem' => $deliveryItem->id]))
        ->assertForbidden();
});

it('deduplicates clicks for the same delivery item', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['is_active' => true]);
    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'is_active' => true,
        'click_count' => 0,
    ]);

    $deliveryItem = JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now(),
        'rank_position' => 1,
        'score' => 55,
        'reason_codes' => ['recent_posting'],
    ]);

    $signedUrl = URL::temporarySignedRoute('job-alert.click', now()->addDay(), ['deliveryItem' => $deliveryItem->id]);

    $this->get($signedUrl)->assertRedirect(route('jobs.show', $job));
    $this->get($signedUrl)->assertRedirect(route('jobs.show', $job));

    expect($subscription->fresh()->click_count)->toBe(1);
    expect(JobAlertDeliveryItem::find($deliveryItem->id)->clicked_at)->not->toBeNull();
    expect(\App\Models\JobAlertClick::query()->where('job_alert_subscription_id', $subscription->id)->count())->toBe(1);
});

it('prevents authenticated cross-user replay of a signed link', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $job = JobListing::factory()->create(['is_active' => true]);

    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $owner->id,
        'frequency' => 'daily',
        'is_active' => true,
    ]);

    $deliveryItem = JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $owner->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now(),
        'rank_position' => 1,
        'score' => 30,
        'reason_codes' => ['recent_posting'],
    ]);

    $signedUrl = URL::temporarySignedRoute('job-alert.click', now()->addDay(), ['deliveryItem' => $deliveryItem->id]);

    $this->actingAs($otherUser)
        ->get($signedUrl)
        ->assertForbidden();

    expect($deliveryItem->fresh()->clicked_at)->toBeNull();
});

it('attributes applications to recent clicked delivery items only within the attribution window', function () {
    config()->set('smart-alerts.attribution_window_days', 7);

    $user = User::factory()->create();
    $jobRecent = JobListing::factory()->create(['is_active' => true]);
    $jobOld = JobListing::factory()->create(['is_active' => true]);

    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'is_active' => true,
    ]);

    $recentItem = JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $jobRecent->id,
        'delivered_at' => now()->subDays(3),
        'rank_position' => 1,
        'score' => 42,
        'reason_codes' => ['recent_posting'],
        'clicked_at' => now()->subDays(2),
    ]);

    $oldItem = JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $jobOld->id,
        'delivered_at' => now()->subDays(12),
        'rank_position' => 2,
        'score' => 40,
        'reason_codes' => ['recent_posting'],
        'clicked_at' => now()->subDays(10),
    ]);

    $this->actingAs($user)->post(route('jobs.apply', $jobRecent))->assertRedirect();
    $this->actingAs($user)->post(route('jobs.apply', $jobOld))->assertRedirect();

    expect($recentItem->fresh()->applied_at)->not->toBeNull();
    expect($oldItem->fresh()->applied_at)->toBeNull();
});

it('exposes accurate smart alert analytics on the admin page', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['is_active' => true]);

    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'is_active' => true,
        'sent_count' => 4,
        'click_count' => 1,
    ]);

    JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now()->subDay(),
        'rank_position' => 1,
        'score' => 80,
        'reason_codes' => ['recent_posting'],
        'is_personalized' => true,
        'clicked_at' => now()->subDay(),
        'applied_at' => now()->subDay(),
    ]);

    JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now()->subDay(),
        'rank_position' => 4,
        'score' => 60,
        'reason_codes' => ['recent_posting'],
        'is_personalized' => true,
    ]);

    JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now()->subDay(),
        'rank_position' => 2,
        'score' => 30,
        'reason_codes' => ['recent_posting'],
        'is_personalized' => false,
    ]);

    JobAlertDeliveryItem::query()->create([
        'job_alert_subscription_id' => $subscription->id,
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'delivered_at' => now()->subDay(),
        'rank_position' => 5,
        'score' => 20,
        'reason_codes' => ['recent_posting'],
        'is_personalized' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.job-alerts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/job-alerts/index')
            ->where('stats.ctr_top_3', 50)
            ->where('stats.ctr_rest', 0)
            ->where('stats.apply_rate_from_alerts', 25)
            ->where('stats.personalized_vs_baseline_lift', 50));
});
