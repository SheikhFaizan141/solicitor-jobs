<?php

use App\Mail\JobAlertDigestMail;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

it('prevents users from exceeding the active job alert limit', function () {
    $user = User::factory()->create();

    JobAlertSubscription::query()->insert([
        ['user_id' => $user->id, 'frequency' => 'daily', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'daily', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'weekly', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'weekly', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'daily', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
    ]);

    $this->actingAs($user)
        ->post(route('job-alerts.store'), [
            'frequency' => 'daily',
        ])
        ->assertSessionHasErrors('limit');

    expect(JobAlertSubscription::query()->where('user_id', $user->id)->count())->toBe(5);
});

it('allows creating an alert when under the active limit', function () {
    $user = User::factory()->create();

    JobAlertSubscription::query()->insert([
        ['user_id' => $user->id, 'frequency' => 'daily', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'weekly', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'daily', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'weekly', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'daily', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()],
        ['user_id' => $user->id, 'frequency' => 'weekly', 'is_active' => false, 'created_at' => now(), 'updated_at' => now()],
    ]);

    $this->actingAs($user)
        ->post(route('job-alerts.store'), [
            'frequency' => 'weekly',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(JobAlertSubscription::query()->where('user_id', $user->id)->count())->toBe(7);
    expect(JobAlertSubscription::query()->where('user_id', $user->id)->where('is_active', true)->count())->toBe(5);
});

it('stores keyword and experience level when creating a job alert', function () {
    $user = User::factory()->create();
    $location = Location::query()->create([
        'name' => 'London',
        'type' => 'city',
        'region' => 'Greater London',
        'country' => 'UK',
        'is_remote' => false,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->post(route('job-alerts.store'), [
            'frequency' => 'daily',
            'keyword' => 'corporate',
            'experience_level' => 'Senior Level',
            'location_id' => $location->id,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $subscription = JobAlertSubscription::query()
        ->where('user_id', $user->id)
        ->latest('id')
        ->first();

    expect($subscription)->not->toBeNull();
    expect($subscription->keyword)->toBe('corporate');
    expect($subscription->experience_level)->toBe('Senior Level');
    expect($subscription->location_id)->toBe($location->id);
});

it('filters digest jobs by keyword', function () {
    Mail::fake();

    $user = User::factory()->create();

    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'keyword' => 'Corporate',
        'is_active' => true,
    ]);

    JobListing::factory()->create([
        'title' => 'Corporate Associate',
        'is_active' => true,
        'published_at' => now()->subHours(2),
    ]);

    JobListing::factory()->create([
        'title' => 'Family Solicitor',
        'is_active' => true,
        'published_at' => now()->subHours(2),
    ]);

    Artisan::call('alerts:send', ['frequency' => 'daily']);

    Mail::assertQueued(JobAlertDigestMail::class, function (JobAlertDigestMail $mail) use ($subscription, $user) {
        return $mail->hasTo($user->email)
            && $mail->subscription->is($subscription)
            && $mail->jobs->count() === 1
            && $mail->jobs->first()->title === 'Corporate Associate';
    });
});

it('filters digest jobs by experience level', function () {
    Mail::fake();

    $user = User::factory()->create();

    $subscription = JobAlertSubscription::query()->create([
        'user_id' => $user->id,
        'frequency' => 'daily',
        'experience_level' => 'Senior Level',
        'is_active' => true,
    ]);

    JobListing::factory()->create([
        'title' => 'Senior Corporate Lawyer',
        'experience_level' => 'Senior Level',
        'is_active' => true,
        'published_at' => now()->subHours(2),
    ]);

    JobListing::factory()->create([
        'title' => 'Junior Solicitor',
        'experience_level' => 'Entry Level',
        'is_active' => true,
        'published_at' => now()->subHours(2),
    ]);

    Artisan::call('alerts:send', ['frequency' => 'daily']);

    Mail::assertQueued(JobAlertDigestMail::class, function (JobAlertDigestMail $mail) use ($subscription, $user) {
        return $mail->hasTo($user->email)
            && $mail->subscription->is($subscription)
            && $mail->jobs->count() === 1
            && $mail->jobs->first()->title === 'Senior Corporate Lawyer';
    });
});
