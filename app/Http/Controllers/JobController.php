<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['q', 'type', 'experience', 'location', 'practice_area', 'firm']);

        $query = JobListing::query()
            ->active()
            ->published()
            ->with(['lawFirm', 'practiceAreas']);

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

        if ($filters['location'] ?? null) {
            $query->where('location', $filters['location']);
        }

        if ($filters['practice_area'] ?? null) {
            $query->whereHas('practiceAreas', function ($query) use ($filters) {
                $query->where('id', $filters['practice_area']);
            });
        }

        if ($filters['firm'] ?? null) {
            $query->where('law_firm_id', $filters['firm']);
        }

        $jobs = $query->latest()->paginate(20);

        // Get filter options
        $locations = JobListing::active()
            ->published()
            ->whereNotNull('location')
            ->distinct()
            ->orderBy('location')
            ->pluck('location')
            ->filter()
            ->values()
            ->toArray();

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
            'filters' => [
                'locations' => $locations,
                'employment_types' => $employmentTypes,
                'experience_levels' => $experienceLevels,
            ],
        ]);
    }

    public function show(JobListing $job)
    {
        $job->load(['lawFirm', 'practiceAreas', 'postedBy']);

        // var_dump($job->toArray()); exit;

        return Inertia::render('jobs/show', [
            'job' => $job,
        ]);
    }
}
