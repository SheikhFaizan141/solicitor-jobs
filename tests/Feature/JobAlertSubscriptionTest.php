<?php

use App\Models\JobAlertSubscription;
use App\Models\User;

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
