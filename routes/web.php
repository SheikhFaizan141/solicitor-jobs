<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminJobAlertController;
use App\Http\Controllers\Admin\AdminJobListingController;
use App\Http\Controllers\Admin\AdminLawFirmController;
use App\Http\Controllers\Admin\AdminLocationController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobAlertClickController;
use App\Http\Controllers\JobAlertSubscriptionController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\LawFirmController;
use App\Http\Controllers\PracticeAreaController;
use App\Mail\JobAlertDigestMail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/law-firms', [LawFirmController::class, 'index'])->name('law-firms.index');

Route::get('/law-firms/{lawFirm:slug}', [LawFirmController::class, 'show'])->name('law-firms.show');

Route::middleware('auth')->group(function () {
    Route::post('/law-firms/{lawFirm:slug}/reviews', [LawFirmController::class, 'storeReview'])->name('law-firms.reviews.store');
});

Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');

Route::get('/jobs/{job:slug}', [JobController::class, 'show'])->name('jobs.show');

Route::get('/job-alert/click', [JobAlertClickController::class, 'track'])->name('job-alert.click');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        // Check if admin
        if ($user->role === 'admin') {
            return Inertia::render('dashboard', [
                'isAdmin' => true,
                'adminStats' => [
                    'totalJobs' => \App\Models\JobListing::count(),
                    'activeJobs' => \App\Models\JobListing::where('is_active', true)->count(),
                    'totalUsers' => \App\Models\User::where('role', 'user')->count(),
                    'totalFirms' => \App\Models\LawFirm::count(),
                ],
            ]);
        }

        // Regular user dashboard
        $activeAlerts = $user->jobAlertSubscriptions()->where('is_active', true);

        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'stats' => [
                'activeAlerts' => $activeAlerts->count(),
                'savedJobs' => 0, // TODO: Implement saved jobs
                'applications' => 0, // TODO: Implement applications  
                'newMatches' => 0, // TODO: Calculate actual job matches
            ],
            'recentAlerts' => $activeAlerts
                ->with('location')
                ->limit(3)
                ->get()
                ->map(fn($alert) => [
                    'id' => $alert->id,
                    'frequency' => $alert->frequency,
                    'location' => $alert->location?->name,
                    'employment_types' => $alert->employment_types,
                    'practice_area_count' => count($alert->practice_area_ids ?? []),
                    'matchCount' => 0, // TODO: Calculate matches
                ]),
            'filterOptions' => [
                'locations' => \App\Models\Location::where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'region', 'country', 'is_remote']),
                'practice_areas' => \App\Models\PracticeArea::orderBy('name')
                    ->get(['id', 'name']),
                'employment_types' => ['full_time', 'part_time', 'contract', 'internship'],
            ],
        ]);
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {

    // JOB ALERT SUBSCRIPTIONS TEST ROUTE - DEV ONLY
    /*     Route::get('/dev/preview-job-alert', function () {
            $user = User::factory()->create(['email' => 'amesaaasaa@example.test']); // [app/Models/User.php](app/Models/User.php)

            $area = PracticeArea::first(); // or PracticeArea::first()
            $job = JobListing::factory()->create([     // [app/Models/JobListing.php](app/Models/JobListing.php)
                'employment_type' => 'full_time',
                'location' => 'London',
                'is_active' => true,
                'published_at' => now(),
            ]);
            $job->practiceAreas()->sync([$area->id]);

            $sub = JobAlertSubscription::create([
                'user_id' => $user->id,
                'frequency' => 'daily',
                'employment_types' => ['full_time'],
                'practice_area_ids' => [$area->id],
                'location' => 'London',
                'is_active' => true,
            ]);


            $subscription = \App\Models\JobAlertSubscription::with('user')->first();
            $jobs = \App\Models\JobListing::with(['lawFirm', 'practiceAreas'])->active()->published()->take(3)->get();

            return new JobAlertDigestMail($subscription, $jobs);
        });
     */

    Route::get('/dev/preview-job-alert', function () {
        $user = \App\Models\User::first(); // Or create a test user

        // Create or get a subscription
        $subscription = \App\Models\JobAlertSubscription::firstOrCreate([
            'user_id' => $user->id,
            'frequency' => 'daily',
        ], [
            'employment_types' => ['full_time', 'contract'],
            'location_id' => \App\Models\Location::first()?->id,
            'is_active' => true,
        ]);

        // Attach practice areas if needed
        if ($subscription->practiceAreas()->count() === 0) {
            $subscription->practiceAreas()->attach(
                \App\Models\PracticeArea::limit(2)->pluck('id')
            );
        }

        // Get some test jobs
        $jobs = \App\Models\JobListing::with(['lawFirm', 'location', 'practiceAreas'])
            ->where('is_active', true)
            ->latest()
            ->limit(5)
            ->get();

        // Return the email view (for browser preview)
        return new \App\Mail\JobAlertDigestMail($subscription, $jobs);
    })->middleware('auth');

    // Route
    Route::get('/job-alerts', [JobAlertSubscriptionController::class, 'index'])->name('job-alerts.index');
    Route::post('/job-alerts', [JobAlertSubscriptionController::class, 'store'])->name('job-alerts.store');
    Route::delete('/job-alerts/{subscription}', [JobAlertSubscriptionController::class, 'destroy'])->name('job-alerts.destroy');

    // Admin Panel (prefix: /admin)
    Route::prefix('admin')->name('admin.')->group(function () {

        // Accessible to both Admin and Editor
        Route::middleware('role:admin,editor')->group(function () {
            // Dashboard
            Route::get('/', AdminDashboardController::class)->name('dashboard');

            // Law Firms
            Route::resource('law-firms', AdminLawFirmController::class)
                ->names('law-firms');

            // Practice Areas
            Route::resource('practice-areas', PracticeAreaController::class)
                ->names('practice-areas')
                ->except(['show']);

            // Job Listings
            Route::resource('job-listings', AdminJobListingController::class)
                ->names('job-listings');
                // ->except(['show']);

            // Locations
            Route::resource('locations', AdminLocationController::class)
                ->names('locations')
                ->except(['show', 'create', 'edit']);

            // Reviews
            Route::prefix('reviews')->name('reviews.')->group(function () {
                Route::get('/', [AdminReviewController::class, 'index'])->name('index');
                Route::get('/spam', [AdminReviewController::class, 'spam'])->name('spam');
                Route::get('/trash', [AdminReviewController::class, 'trash'])->name('trash');
                Route::post('/bulk', [AdminReviewController::class, 'bulkAction'])->name('bulk');
                Route::post('/{review}/spam', [AdminReviewController::class, 'markAsSpam'])->name('spam.mark');
                Route::post('/{review}/trash', [AdminReviewController::class, 'moveToTrash'])->name('trash.move');
                Route::post('/{id}/restore', [AdminReviewController::class, 'restore'])->name('restore');
                Route::delete('/{id}/force', [AdminReviewController::class, 'forceDelete'])->name('force-delete');
            });
        });

        // Only Admins (for User Management)
        Route::middleware('role:admin')->group(function () {
            Route::resource('users', AdminUserController::class)
                ->names('users')
                ->except(['show']);

            Route::resource('job-alerts', AdminJobAlertController::class)->only(['index', 'update', 'destroy']);
            Route::post('job-alerts/bulk-destroy', [AdminJobAlertController::class, 'bulkDestroy'])->name('job-alerts.bulk-destroy');
            Route::post('job-alerts/bulk-toggle', [AdminJobAlertController::class, 'bulkToggle'])->name('job-alerts.bulk-toggle');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
