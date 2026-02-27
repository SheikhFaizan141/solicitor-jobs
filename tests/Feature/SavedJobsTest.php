<?php

use App\Models\JobListing;
use App\Models\User;
use App\Models\UserJobInteraction;

it('lets users save a job', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create();

    $this->actingAs($user)
        ->post(route('jobs.save', $job))
        ->assertRedirect();

    $this->assertDatabaseHas('user_job_interactions', [
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_SAVED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
    ]);
});

it('archives a saved job when unsaved', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create();

    UserJobInteraction::create([
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_SAVED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
    ]);

    $this->actingAs($user)
        ->delete(route('jobs.unsave', $job))
        ->assertRedirect();

    $this->assertDatabaseHas('user_job_interactions', [
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_SAVED,
        'status' => UserJobInteraction::STATUS_ARCHIVED,
    ]);
});

it('updates notes on a saved job', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create();

    $interaction = UserJobInteraction::create([
        'user_id' => $user->id,
        'job_listing_id' => $job->id,
        'type' => UserJobInteraction::TYPE_SAVED,
        'status' => UserJobInteraction::STATUS_ACTIVE,
    ]);

    $this->actingAs($user)
        ->patch(route('saved-jobs.notes.update', $interaction), [
            'notes' => 'Follow up next week.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('user_job_interactions', [
        'id' => $interaction->id,
        'notes' => 'Follow up next week.',
    ]);
});

it('shows saved jobs list for authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('saved-jobs.index'))
        ->assertOk();
});

it('redirects guests trying to view saved jobs', function () {
    $this->get(route('saved-jobs.index'))
        ->assertRedirect(route('login'));
});
