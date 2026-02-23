<?php

use App\Models\JobListing;
use App\Models\User;
use App\Models\UserJobInteraction;

// --- Index ---

it('shows applied jobs list for authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('applied-jobs.index'))
        ->assertOk();
});

it('redirects guests trying to view applied jobs', function () {
    $this->get(route('applied-jobs.index'))
        ->assertRedirect(route('login'));
});

// --- Store ---

it('tracks an application when a logged-in user clicks Apply Now', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['is_active' => true]);

    $this->actingAs($user)
        ->post(route('jobs.apply', $job))
        ->assertRedirect();

    $interaction = UserJobInteraction::query()
        ->where('user_id', $user->id)
        ->where('job_listing_id', $job->id)
        ->where('type', UserJobInteraction::TYPE_APPLIED)
        ->first();

    expect($interaction)->not->toBeNull()
        ->and($interaction->status)->toBe(UserJobInteraction::STATUS_ACTIVE)
        ->and($interaction->metadata['application_status'])->toBe(UserJobInteraction::APPLICATION_STATUS_APPLIED)
        ->and($interaction->metadata['applied_at'])->not->toBeNull();
});

it('does not create duplicate applied interactions (idempotent)', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['is_active' => true]);

    $this->actingAs($user)->post(route('jobs.apply', $job));
    $this->actingAs($user)->post(route('jobs.apply', $job));

    $count = UserJobInteraction::query()
        ->where('user_id', $user->id)
        ->where('job_listing_id', $job->id)
        ->where('type', UserJobInteraction::TYPE_APPLIED)
        ->count();

    expect($count)->toBe(1);
});

it('redirects guests trying to track an application', function () {
    $job = JobListing::factory()->create();

    $this->post(route('jobs.apply', $job))
        ->assertRedirect(route('login'));
});

// --- UpdateStatus ---

it('updates the application status', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create();

    $interaction = UserJobInteraction::create([
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_APPLIED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
        'metadata' => [
            'application_status' => UserJobInteraction::APPLICATION_STATUS_APPLIED,
            'applied_at' => now()->toISOString(),
        ],
    ]);

    $this->actingAs($user)
        ->patch(route('applied-jobs.status.update', $interaction), [
            'application_status' => 'interview',
        ])
        ->assertRedirect();

    expect($interaction->fresh()->metadata['application_status'])->toBe('interview');
});

it('rejects an invalid application status', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create();

    $interaction = UserJobInteraction::create([
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_APPLIED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
        'metadata' => [
            'application_status' => UserJobInteraction::APPLICATION_STATUS_APPLIED,
            'applied_at' => now()->toISOString(),
        ],
    ]);

    $this->actingAs($user)
        ->patch(route('applied-jobs.status.update', $interaction), [
            'application_status' => 'ghosted',
        ])
        ->assertSessionHasErrors('application_status');
});

it('prevents a user from updating another user\'s application status', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $job = JobListing::factory()->create();

    $interaction = UserJobInteraction::create([
        'user_id' => $otherUser->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_APPLIED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
        'metadata' => [
            'application_status' => UserJobInteraction::APPLICATION_STATUS_APPLIED,
            'applied_at' => now()->toISOString(),
        ],
    ]);

    $this->actingAs($user)
        ->patch(route('applied-jobs.status.update', $interaction), [
            'application_status' => 'interview',
        ])
        ->assertNotFound();
});

// --- Destroy ---

it('archives an applied interaction when removed', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create();

    $interaction = UserJobInteraction::create([
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_APPLIED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
        'metadata' => [
            'application_status' => UserJobInteraction::APPLICATION_STATUS_APPLIED,
            'applied_at' => now()->toISOString(),
        ],
    ]);

    $this->actingAs($user)
        ->delete(route('applied-jobs.destroy', $interaction))
        ->assertRedirect();

    expect($interaction->fresh()->status)->toBe(UserJobInteraction::STATUS_ARCHIVED);
});

it('prevents a user from removing another user\'s application', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $job = JobListing::factory()->create();

    $interaction = UserJobInteraction::create([
        'user_id' => $otherUser->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_APPLIED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
        'metadata' => [
            'application_status' => UserJobInteraction::APPLICATION_STATUS_APPLIED,
            'applied_at' => now()->toISOString(),
        ],
    ]);

    $this->actingAs($user)
        ->delete(route('applied-jobs.destroy', $interaction))
        ->assertNotFound();
});
