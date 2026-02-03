<?php

use App\Models\JobListing;
use App\Models\User;

beforeEach(function () {
    // Create admin and editor users for testing
    $this->admin = User::factory()->admin()->create();
    $this->editor = User::factory()->editor()->create();
    $this->regularUser = User::factory()->user()->create();
    $this->jobListing = JobListing::factory()->create();
});

describe('Job Listing Edit Access', function () {
    it('allows admin to access edit page and acquires lock', function () {
        $this->actingAs($this->admin)
            ->get(route('admin.job-listings.edit', $this->jobListing))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/job-listings/edit'));

        // Verify lock was acquired
        $this->jobListing->refresh();
        expect($this->jobListing->locked_by)->toBe($this->admin->id);
        expect($this->jobListing->locked_at)->not->toBeNull();
    });

    it('allows editor to access edit page and acquires lock', function () {
        $this->actingAs($this->editor)
            ->get(route('admin.job-listings.edit', $this->jobListing))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/job-listings/edit'));

        // Verify lock was acquired
        $this->jobListing->refresh();
        expect($this->jobListing->locked_by)->toBe($this->editor->id);
    });

    it('denies regular user access to edit page', function () {
        $this->actingAs($this->regularUser)
            ->get(route('admin.job-listings.edit', $this->jobListing))
            ->assertForbidden();
    });
});

describe('Job Listing Locking', function () {
    it('shows locked page when another user is editing', function () {
        // First user acquires lock
        $this->jobListing->acquireLock($this->admin);

        // Second user tries to edit
        $this->actingAs($this->editor)
            ->get(route('admin.job-listings.edit', $this->jobListing))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/job-listings/locked')
                ->has('lockedBy')
                ->where('lockedBy.name', $this->admin->name)
                ->where('lockedBy.email', $this->admin->email));
    });

    it('allows same user to continue editing (extends lock)', function () {
        // Admin acquires lock
        $this->jobListing->acquireLock($this->admin);
        $originalLockTime = $this->jobListing->locked_at;

        // Admin accesses edit page again
        $this->travel(1)->minutes();

        $this->actingAs($this->admin)
            ->get(route('admin.job-listings.edit', $this->jobListing))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/job-listings/edit'));

        // Lock should be refreshed
        $this->jobListing->refresh();
        expect($this->jobListing->locked_at->greaterThan($originalLockTime))->toBeTrue();
    });

    it('allows access when lock has expired (15 minutes)', function () {
        // First user acquires lock
        $this->jobListing->acquireLock($this->admin);

        // Travel 16 minutes into the future (lock expires after 15 minutes)
        $this->travel(16)->minutes();

        // Second user should now be able to edit
        $this->actingAs($this->editor)
            ->get(route('admin.job-listings.edit', $this->jobListing))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/job-listings/edit'));

        // Lock should now belong to editor
        $this->jobListing->refresh();
        expect($this->jobListing->locked_by)->toBe($this->editor->id);
    });
});

describe('Lock Refresh (Heartbeat)', function () {
    it('refreshes lock for the lock owner', function () {
        $this->jobListing->acquireLock($this->admin);
        $originalLockTime = $this->jobListing->locked_at;

        $this->travel(5)->minutes();

        $this->actingAs($this->admin)
            ->postJson(route('admin.job-listings.refresh-lock', $this->jobListing))
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->jobListing->refresh();
        expect($this->jobListing->locked_at->greaterThan($originalLockTime))->toBeTrue();
    });

    it('fails to refresh lock for non-owner', function () {
        $this->jobListing->acquireLock($this->admin);

        $this->actingAs($this->editor)
            ->postJson(route('admin.job-listings.refresh-lock', $this->jobListing))
            ->assertForbidden()
            ->assertJson(['success' => false]);
    });
});

describe('Lock Release', function () {
    it('releases lock for the lock owner', function () {
        $this->jobListing->acquireLock($this->admin);

        $this->actingAs($this->admin)
            ->postJson(route('admin.job-listings.release-lock', $this->jobListing))
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->jobListing->refresh();
        expect($this->jobListing->locked_by)->toBeNull();
        expect($this->jobListing->locked_at)->toBeNull();
    });

    it('does not release lock when requested by non-owner', function () {
        $this->jobListing->acquireLock($this->admin);

        $this->actingAs($this->editor)
            ->postJson(route('admin.job-listings.release-lock', $this->jobListing))
            ->assertOk(); // Still returns OK but lock remains

        $this->jobListing->refresh();
        expect($this->jobListing->locked_by)->toBe($this->admin->id);
    });

    it('releases lock after successful update', function () {
        $this->jobListing->acquireLock($this->admin);

        $this->actingAs($this->admin)
            ->put(route('admin.job-listings.update', $this->jobListing), [
                'title' => 'Updated Title',
                'workplace_type' => 'remote',
                'employment_type' => 'full_time',
                'salary_currency' => 'GBP',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.job-listings.index'));

        $this->jobListing->refresh();
        expect($this->jobListing->locked_by)->toBeNull();
        expect($this->jobListing->locked_at)->toBeNull();
    });
});

describe('JobListing Model Lock Methods', function () {
    it('correctly identifies when listing is locked', function () {
        expect($this->jobListing->isLocked())->toBeFalse();

        $this->jobListing->acquireLock($this->admin);
        expect($this->jobListing->isLocked())->toBeTrue();
    });

    it('correctly identifies when locked by another user', function () {
        expect($this->jobListing->isLockedByAnotherUser($this->editor))->toBeFalse();

        $this->jobListing->acquireLock($this->admin);
        expect($this->jobListing->isLockedByAnotherUser($this->editor))->toBeTrue();
        expect($this->jobListing->isLockedByAnotherUser($this->admin))->toBeFalse();
    });

    it('expires lock after 15 minutes', function () {
        $this->jobListing->acquireLock($this->admin);

        expect($this->jobListing->isLocked())->toBeTrue();

        $this->travel(14)->minutes();
        expect($this->jobListing->fresh()->isLocked())->toBeTrue();

        $this->travel(2)->minutes();
        expect($this->jobListing->fresh()->isLocked())->toBeFalse();
    });
});
