<?php

use App\Models\JobListing;
use App\Models\LawFirm;

describe('Public law firm visibility', function () {
    it('returns 404 for an inactive law firm', function () {
        $firm = LawFirm::factory()->inactive()->create();

        $this->get("/law-firms/{$firm->slug}")
            ->assertNotFound();
    });

    it('returns 404 for a soft-deleted law firm', function () {
        $firm = LawFirm::factory()->create();
        $firm->delete();

        $this->get("/law-firms/{$firm->slug}")
            ->assertNotFound();
    });

    it('hides inactive firms from the public index', function () {
        LawFirm::factory()->create(['name' => 'Visible Firm', 'is_active' => true]);
        LawFirm::factory()->inactive()->create(['name' => 'Hidden Firm']);

        $this->get('/law-firms')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('law-firms/index')
                ->where('lawFirms.total', 1)
                ->where('lawFirms.data.0.name', 'Visible Firm'));
    });

    it('hides soft-deleted firms from the public index', function () {
        $visible = LawFirm::factory()->create(['name' => 'Visible Firm']);
        $deleted = LawFirm::factory()->create(['name' => 'Deleted Firm']);
        $deleted->delete();

        $this->get('/law-firms')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('lawFirms.total', 1)
                ->where('lawFirms.data.0.id', $visible->id));
    });
});

describe('Public job visibility with inactive/deleted firms', function () {
    it('hides jobs belonging to an inactive firm from the public jobs index', function () {
        $location = \App\Models\Location::create(['name' => 'London', 'slug' => 'london-' . uniqid()]);
        $inactiveFirm = LawFirm::factory()->inactive()->create();
        $activeFirm = LawFirm::factory()->create();

        JobListing::factory()->create([
            'law_firm_id' => $inactiveFirm->id,
            'location_id' => $location->id,
            'title' => 'Hidden Job',
            'is_active' => true,
            'published_at' => now(),
        ]);

        JobListing::factory()->create([
            'law_firm_id' => $activeFirm->id,
            'location_id' => $location->id,
            'title' => 'Visible Job',
            'is_active' => true,
            'published_at' => now(),
        ]);

        $this->get('/jobs')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('jobs.total', 1)
                ->where('jobs.data.0.title', 'Visible Job'));
    });

    it('hides jobs belonging to a soft-deleted firm from the public jobs index', function () {
        $location = \App\Models\Location::create(['name' => 'Manchester', 'slug' => 'manchester-' . uniqid()]);
        $deletedFirm = LawFirm::factory()->create();
        $activeFirm = LawFirm::factory()->create();

        JobListing::factory()->create([
            'law_firm_id' => $deletedFirm->id,
            'location_id' => $location->id,
            'title' => 'Hidden Job',
            'is_active' => true,
            'published_at' => now(),
        ]);

        JobListing::factory()->create([
            'law_firm_id' => $activeFirm->id,
            'location_id' => $location->id,
            'title' => 'Visible Job',
            'is_active' => true,
            'published_at' => now(),
        ]);

        $deletedFirm->delete();

        $this->get('/jobs')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('jobs.total', 1)
                ->where('jobs.data.0.title', 'Visible Job'));
    });
});
