<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        return Inertia::render('admin/index', [
            'stats' => [
                'lawFirms' => [
                    'total' => LawFirm::count(),
                    'active' => 10, // placeholder
                ],
                'jobs' => [
                    'total' => JobListing::count(),
                    'active' => JobListing::where('is_active', true)->count(),
                ],
                'reviews' => [
                    'total' => Review::count(),
                    'pending' => Review::where('status', 'pending')->count(),
                ],
                'users' => [
                    'total' => User::count(),
                    'newThisMonth' => User::where('created_at', '>=', now()->startOfMonth())->count(),
                ],
                'jobAlerts' => [
                    'total' => JobAlertSubscription::count(),
                    'active' => JobAlertSubscription::where('is_active', true)->count(),
                    'peopleWithActiveAlerts' => JobAlertSubscription::where('is_active', true)
                        ->distinct('user_id')
                        ->count('user_id'),
                    'newThisMonth' => JobAlertSubscription::where('created_at', '>=', now()->startOfMonth())->count(),
                ],
            ],
        ]);
    }
}
