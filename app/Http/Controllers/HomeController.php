<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
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
            'filters' => $filters,
            'filterOptions' => [
                'locations' => $locations,
                'practiceAreas' => $practiceAreas,
            ],
            'totalJobs' => $totalJobs,
        ]);
    }
}
