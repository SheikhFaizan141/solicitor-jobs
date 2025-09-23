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
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($filters['type'] ?? null) {
            $query->where('employment_type', $filters['type']);
        }

        if ($filters['experience'] ?? null) {
            $query->where('experience_level', 'like', "%{$filters['experience']}%");
        }

        if ($filters['location'] ?? null) {
            $query->where('location', 'like', "%{$filters['location']}%");
        }

        if ($filters['practice_area'] ?? null) {
            $query->whereHas('practiceAreas', fn($q) => $q->where('id', $filters['practice_area']));
        }

        if ($filters['firm'] ?? null) {
            $query->where('law_firm_id', $filters['firm']);
        }

        $jobs = $query->latest('published_at')->paginate(12)->withQueryString();

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'filters' => $filters,
            'practiceAreas' => PracticeArea::orderBy('name')->get(['id', 'name']),
            'firms' => LawFirm::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function show(JobListing $jobListing)
    {
        abort_unless($jobListing->is_active && $jobListing->published_at, 404);

        return Inertia::render('jobs/show', [
            'job' => $jobListing->load(['lawFirm', 'practiceAreas', 'postedBy']),
        ]);
    }
}
