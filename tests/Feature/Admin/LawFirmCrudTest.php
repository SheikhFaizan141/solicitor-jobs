<?php

use App\Models\LawFirm;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

describe('Law Firm store', function () {
    it('stores excerpt and is_active when creating a law firm', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.law-firms.store'), [
                'name' => 'Smith & Co Solicitors',
                'excerpt' => 'A specialist employment law firm.',
                'is_active' => true,
                'website' => 'https://smith.co.uk',
                'practice_areas' => [],
                'contacts' => [],
            ])
            ->assertRedirect(route('admin.law-firms.index'));

        $firm = LawFirm::where('name', 'Smith & Co Solicitors')->first();
        expect($firm)->not->toBeNull();
        expect($firm->excerpt)->toBe('A specialist employment law firm.');
        expect($firm->is_active)->toBeTrue();
    });

    it('stores is_active as false when explicitly set', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.law-firms.store'), [
                'name' => 'Inactive Firm',
                'is_active' => false,
                'practice_areas' => [],
                'contacts' => [],
            ])
            ->assertRedirect(route('admin.law-firms.index'));

        expect(LawFirm::where('name', 'Inactive Firm')->first()->is_active)->toBeFalse();
    });

    it('rejects an excerpt longer than 500 characters', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.law-firms.store'), [
                'name' => 'Test Firm',
                'excerpt' => str_repeat('a', 501),
                'practice_areas' => [],
                'contacts' => [],
            ])
            ->assertSessionHasErrors('excerpt');
    });
});

describe('Law Firm update', function () {
    it('updates excerpt and is_active', function () {
        $firm = LawFirm::factory()->create(['is_active' => true, 'excerpt' => null]);

        $this->actingAs($this->admin)
            ->put(route('admin.law-firms.update', $firm), [
                'name' => $firm->name,
                'excerpt' => 'Updated excerpt.',
                'is_active' => false,
                'practice_areas' => [],
                'contacts' => [],
            ])
            ->assertRedirect(route('admin.law-firms.index'));

        $firm->refresh();
        expect($firm->excerpt)->toBe('Updated excerpt.');
        expect($firm->is_active)->toBeFalse();
    });
});

describe('Law Firm soft delete', function () {
    it('soft-deletes a law firm and hides it from the admin index', function () {
        $firm = LawFirm::factory()->create();

        $this->actingAs($this->admin)
            ->delete(route('admin.law-firms.destroy', $firm))
            ->assertRedirect(route('admin.law-firms.index'));

        expect(LawFirm::find($firm->id))->toBeNull();
        expect(LawFirm::withTrashed()->find($firm->id))->not->toBeNull();
    });
});

describe('Law Firm trash', function () {
    it('shows soft-deleted firms on the trash page', function () {
        $firm = LawFirm::factory()->create();
        $firm->delete();

        $this->actingAs($this->admin)
            ->get(route('admin.law-firms.trash'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/law-firms/trash')
                ->has('lawFirms.data', 1)
                ->where('lawFirms.data.0.id', $firm->id));
    });

    it('restores a soft-deleted law firm', function () {
        $firm = LawFirm::factory()->create();
        $firm->delete();

        $this->actingAs($this->admin)
            ->post("/admin/law-firms/{$firm->id}/restore")
            ->assertRedirect(route('admin.law-firms.trash'));

        expect(LawFirm::find($firm->id))->not->toBeNull();
    });

    it('permanently deletes a soft-deleted law firm', function () {
        $firm = LawFirm::factory()->create();
        $firm->delete();

        $this->actingAs($this->admin)
            ->delete("/admin/law-firms/{$firm->id}/force-destroy")
            ->assertRedirect(route('admin.law-firms.trash'));

        expect(LawFirm::withTrashed()->find($firm->id))->toBeNull();
    });
});

describe('Admin status filter', function () {
    it('filters active firms correctly', function () {
        LawFirm::factory()->create(['name' => 'Active Firm', 'is_active' => true]);
        LawFirm::factory()->inactive()->create(['name' => 'Inactive Firm']);

        $this->actingAs($this->admin)
            ->get(route('admin.law-firms.index', ['status' => 'active']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('lawFirms.data.0.name', 'Active Firm')
                ->where('lawFirms.total', 1));
    });

    it('filters inactive firms correctly', function () {
        LawFirm::factory()->create(['name' => 'Active Firm', 'is_active' => true]);
        LawFirm::factory()->inactive()->create(['name' => 'Inactive Firm']);

        $this->actingAs($this->admin)
            ->get(route('admin.law-firms.index', ['status' => 'inactive']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('lawFirms.data.0.name', 'Inactive Firm')
                ->where('lawFirms.total', 1));
    });
});
