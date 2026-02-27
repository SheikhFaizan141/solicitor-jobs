<?php

use App\Models\LawFirm;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
    $this->editor = User::factory()->editor()->create();
    $this->regularUser = User::factory()->user()->create();
    $this->lawFirm = LawFirm::factory()->create();
});

describe('Law Firm Edit Access', function () {
    it('allows admin to access edit page and acquires lock', function () {
        $this->actingAs($this->admin)
            ->get(route('admin.law-firms.edit', $this->lawFirm))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/law-firms/edit'));

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_by)->toBe($this->admin->id);
        expect($this->lawFirm->locked_at)->not->toBeNull();
    });

    it('allows editor to access edit page and acquires lock', function () {
        $this->actingAs($this->editor)
            ->get(route('admin.law-firms.edit', $this->lawFirm))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/law-firms/edit'));

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_by)->toBe($this->editor->id);
    });
});

describe('Law Firm Locking', function () {
    it('shows locked page when another user is editing', function () {
        $this->lawFirm->acquireLock($this->admin);

        $this->actingAs($this->editor)
            ->get(route('admin.law-firms.edit', $this->lawFirm))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/law-firms/locked')
                ->has('lockedBy')
                ->where('lockedBy.name', $this->admin->name)
                ->where('lockedBy.email', $this->admin->email));
    });

    it('allows same user to continue editing (extends lock)', function () {
        $this->lawFirm->acquireLock($this->admin);
        $originalLockTime = $this->lawFirm->locked_at;

        $this->travel(1)->minutes();

        $this->actingAs($this->admin)
            ->get(route('admin.law-firms.edit', $this->lawFirm))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/law-firms/edit'));

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_at->greaterThan($originalLockTime))->toBeTrue();
    });

    it('allows access when lock has expired (15 minutes)', function () {
        $this->lawFirm->acquireLock($this->admin);

        $this->travel(16)->minutes();

        $this->actingAs($this->editor)
            ->get(route('admin.law-firms.edit', $this->lawFirm))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/law-firms/edit'));

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_by)->toBe($this->editor->id);
    });
});

describe('Lock Refresh (Heartbeat)', function () {
    it('refreshes lock for the lock owner', function () {
        $this->lawFirm->acquireLock($this->admin);
        $originalLockTime = $this->lawFirm->locked_at;

        $this->travel(5)->minutes();

        $this->actingAs($this->admin)
            ->postJson(route('admin.law-firms.refresh-lock', $this->lawFirm))
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_at->greaterThan($originalLockTime))->toBeTrue();
    });

    it('fails to refresh lock for non-owner', function () {
        $this->lawFirm->acquireLock($this->admin);

        $this->actingAs($this->editor)
            ->postJson(route('admin.law-firms.refresh-lock', $this->lawFirm))
            ->assertForbidden()
            ->assertJson(['success' => false]);
    });
});

describe('Lock Release', function () {
    it('releases lock for the lock owner', function () {
        $this->lawFirm->acquireLock($this->admin);

        $this->actingAs($this->admin)
            ->postJson(route('admin.law-firms.release-lock', $this->lawFirm))
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_by)->toBeNull();
        expect($this->lawFirm->locked_at)->toBeNull();
    });

    it('does not release lock when requested by non-owner', function () {
        $this->lawFirm->acquireLock($this->admin);

        $this->actingAs($this->editor)
            ->postJson(route('admin.law-firms.release-lock', $this->lawFirm))
            ->assertOk();

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_by)->toBe($this->admin->id);
    });

    it('releases lock after successful update', function () {
        $this->lawFirm->acquireLock($this->admin);

        $this->actingAs($this->admin)
            ->put(route('admin.law-firms.update', $this->lawFirm), [
                'name' => 'Updated Firm Name',
            ])
            ->assertRedirect(route('admin.law-firms.index'));

        $this->lawFirm->refresh();
        expect($this->lawFirm->locked_by)->toBeNull();
        expect($this->lawFirm->locked_at)->toBeNull();
    });
});

describe('LawFirm Model Lock Methods', function () {
    it('correctly identifies when law firm is locked', function () {
        expect($this->lawFirm->isLocked())->toBeFalse();

        $this->lawFirm->acquireLock($this->admin);
        expect($this->lawFirm->isLocked())->toBeTrue();
    });

    it('correctly identifies when locked by another user', function () {
        expect($this->lawFirm->isLockedByAnotherUser($this->editor))->toBeFalse();

        $this->lawFirm->acquireLock($this->admin);
        expect($this->lawFirm->isLockedByAnotherUser($this->editor))->toBeTrue();
        expect($this->lawFirm->isLockedByAnotherUser($this->admin))->toBeFalse();
    });

    it('expires lock after 15 minutes', function () {
        $this->lawFirm->acquireLock($this->admin);

        expect($this->lawFirm->isLocked())->toBeTrue();

        $this->travel(14)->minutes();
        expect($this->lawFirm->fresh()->isLocked())->toBeTrue();

        $this->travel(2)->minutes();
        expect($this->lawFirm->fresh()->isLocked())->toBeFalse();
    });
});
