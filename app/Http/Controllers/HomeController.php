<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\Location;
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
        // Featured/Latest jobs
        $featuredJobs = JobListing::query()
            ->active()
            ->published()
            ->with(['lawFirm', 'practiceAreas', 'location'])
            ->latest()
            ->limit(6)
            ->get();

        // Get filter options for the search form
        $locations = Location::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'region', 'country', 'is_remote']);

        $practiceAreas = PracticeArea::orderBy('name')
            ->get(['id', 'name']);

        // Job statistics
        $totalJobs = JobListing::active()->published()->count();

        return Inertia::render('home', [
            'featuredJobs' => $featuredJobs,
            'filterOptions' => [
                'locations' => $locations,
                'practiceAreas' => $practiceAreas,
            ],
            'totalJobs' => $totalJobs,
        ]);
    }
}
