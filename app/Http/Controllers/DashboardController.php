<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = $request->user();

        // Check if admin1
        if ($user->hasRole('admin')) {
            return Inertia::render('app/dashboard', [
                'isAdmin' => true,
                'adminStats' => [
                    'totalJobs' => \App\Models\JobListing::count(),
                    'activeJobs' => \App\Models\JobListing::where('is_active', true)->count(),
                    'totalUsers' => \App\Models\User::role('user')->count(),
                    'totalFirms' => \App\Models\LawFirm::count(),
                ],
            ]);
        }

        // Regular user dashboard
        $activeAlertsCount = $user->jobAlertSubscriptions()->where('is_active', true)->count();
        $savedJobsCount = $user->savedJobInteractions()->count();

        return Inertia::render('app/dashboard', [
            'isAdmin' => false,
            'stats' => [
                'activeAlerts' => $activeAlertsCount,
                'savedJobs' => $savedJobsCount,
                'applications' => $user->appliedJobInteractions()->count(),
                'newMatches' => 0, // TODO: Calculate actual job matches
            ],
        ]);
    }
}
