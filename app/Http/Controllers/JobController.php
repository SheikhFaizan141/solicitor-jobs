<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\Location;
use App\Models\PracticeArea;
use App\Models\UserJobInteraction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['q', 'type', 'experience', 'location_id', 'practice_area_id', 'firm']);

        $query = JobListing::query()
            ->active()
            ->published()
            ->with(['lawFirm', 'practiceAreas'])
            ->where(function ($q): void {
                // Allow jobs with no firm, or jobs from active, non-deleted firms
                $q->whereNull('law_firm_id')
                    ->orWhereHas('lawFirm', fn ($q) => $q->active());
            });

        if ($filters['q'] ?? null) {
            $q = $filters['q'];
            $query->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhereHas('lawFirm', function ($query) use ($q) {
                        $query->where('name', 'like', "%{$q}%");
                    })
                    ->orWhereHas('practiceAreas', function ($query) use ($q) {
                        $query->where('name', 'like', "%{$q}%");
                    });
            });
        }

        if ($filters['type'] ?? null) {
            $query->where('employment_type', $filters['type']);
        }

        if ($filters['experience'] ?? null) {
            $query->where('experience_level', $filters['experience']);
        }

        if ($filters['location_id'] ?? null) {
            $query->where('location_id', $filters['location_id']);
        }

        if ($filters['practice_area_id'] ?? null) {
            $query->whereHas('practiceAreas', function ($query) use ($filters) {
                $query->where('practice_areas.id', $filters['practice_area_id']);
            });
        }

        if ($filters['firm'] ?? null) {
            $query->where('law_firm_id', $filters['firm']);
        }

        $jobs = $query->latest()->paginate(20)->withQueryString();

        $savedJobIds = [];
        if ($request->user()) {
            $savedJobIds = $request->user()
                ->jobInteractions()
                ->where('type', UserJobInteraction::TYPE_SAVED)
                ->where('status', UserJobInteraction::STATUS_ACTIVE)
                ->whereIn('job_listing_id', $jobs->getCollection()->pluck('id'))
                ->pluck('job_listing_id')
                ->all();
        }

        // Get filter options
        // $locations = JobListing::active()
        //     ->published()
        //     ->whereNotNull('location')
        //     ->distinct()
        //     ->orderBy('location')
        //     ->pluck('location')
        //     ->filter()
        //     ->values()
        //     ->toArray();

        $locations = Location::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'region', 'country', 'is_remote']);

        $practiceAreas = PracticeArea::orderBy('name')
            ->get(['id', 'name']);

        $employmentTypes = JobListing::active()
            ->published()
            ->distinct()
            ->orderBy('employment_type')
            ->pluck('employment_type')
            ->toArray();

        $experienceLevels = JobListing::active()
            ->published()
            ->whereNotNull('experience_level')
            ->distinct()
            ->orderBy('experience_level')
            ->pluck('experience_level')
            ->filter()
            ->values()
            ->toArray();

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'savedJobIds' => $savedJobIds,
            'filters' => [
                'locations' => $locations,
                'employment_types' => $employmentTypes,
                'experience_levels' => $experienceLevels,
                'practiceAreas' => $practiceAreas,
            ],
            'filterOptions' => [
                'locations' => $locations,
                'employment_types' => $employmentTypes,
                'practice_areas' => $practiceAreas,
                'experience_levels' => $experienceLevels,
            ],
            'appliedFilters' => $filters,
        ]);
    }

    public function show(Request $request, JobListing $job)
    {
        $job->load(['lawFirm', 'practiceAreas', 'location',  'postedBy']);

        $isSaved = false;
        $hasApplied = false;
        if ($request->user()) {
            $isSaved = $request->user()
                ->jobInteractions()
                ->where('type', UserJobInteraction::TYPE_SAVED)
                ->where('status', UserJobInteraction::STATUS_ACTIVE)
                ->where('job_listing_id', $job->id)
                ->exists();

            $hasApplied = $request->user()
                ->jobInteractions()
                ->where('type', UserJobInteraction::TYPE_APPLIED)
                ->where('status', UserJobInteraction::STATUS_ACTIVE)
                ->where('job_listing_id', $job->id)
                ->exists();
        }

        return Inertia::render('jobs/show', [
            'job' => $job,
            'isSaved' => $isSaved,
            'hasApplied' => $hasApplied,
        ]);
    }

    public function home(Request $request)
    {
        $filters = $request->only(['q', 'location', 'practice_area']);

        // Ensure all filter keys exist with default values
        $filters = array_merge([
            'q' => null,
            'location' => null,
            'practice_area' => null,
        ], $filters);

        // Featured/Latest jobs
        $featuredJobs = JobListing::query()
            ->active()
            ->published()
            ->with(['lawFirm', 'practiceAreas'])
            ->latest()
            ->limit(6)
            ->get();

        // Search functionality
        $jobsQuery = JobListing::query()
            ->active()
            ->published()
            ->with(['lawFirm', 'practiceAreas']);

        if (! empty($filters['q'])) {
            $q = $filters['q'];
            $jobsQuery->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhereHas('lawFirm', function ($query) use ($q) {
                        $query->where('name', 'like', "%{$q}%");
                    });
            });
        }

        if (! empty($filters['location'])) {
            $jobsQuery->where('location', 'like', "%{$filters['location']}%");
        }

        if (! empty($filters['practice_area'])) {
            $jobsQuery->whereHas('practiceAreas', function ($query) use ($filters) {
                $query->where('id', $filters['practice_area']);
            });
        }

        $searchResults = (! empty($filters['q']) || ! empty($filters['location']) || ! empty($filters['practice_area']))
            ? $jobsQuery->latest()->paginate(10)
            : null;

        // Get filter options
        $locations = JobListing::active()
            ->published()
            ->whereNotNull('location')
            ->distinct()
            ->orderBy('location')
            ->pluck('location')
            ->filter()
            ->unique()
            ->take(20)
            ->values()
            ->toArray();

        $practiceAreas = PracticeArea::orderBy('name')->get(['id', 'name']);

        // Job statistics
        $totalJobs = JobListing::active()->published()->count();

        return Inertia::render('jobs/home', [
            'featuredJobs' => $featuredJobs,
            'searchResults' => $searchResults,
            'filters' => $filters,
            'filterOptions' => [
                'locations' => $locations,
                'practiceAreas' => $practiceAreas,
            ],
            'totalJobs' => $totalJobs,
        ]);
    }
}
