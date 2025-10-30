<?php

use App\Http\Controllers\Admin\AdminJobListingController;
use App\Http\Controllers\Admin\AdminLawFirmController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\LawFirmController;
use App\Http\Controllers\PracticeAreaController;
use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', HomeController::class)->name('home');

Route::get('/law-firms', [LawFirmController::class, 'index'])->name('law-firms.index');

Route::get('/law-firms/{lawFirm:slug}', [LawFirmController::class, 'show'])->name('law-firms.show');

// Review submission route for authenticated users
Route::middleware('auth')->group(function () {
    Route::post('/law-firms/{lawFirm:slug}/reviews', [LawFirmController::class, 'storeReview'])->name('law-firms.reviews.store');
});

/* JOBS */
// Route::get('/', [JobController::class, 'home'])->name('jobs.home');

Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');

Route::get('/jobs/{job:slug}', [JobController::class, 'show'])->name('jobs.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::middleware(['auth'])->group(function () {
    // Admin Panel (prefix: /admin)
    Route::prefix('admin')->name('admin.')->group(function () {

        // Accessible to both Admin and Editor
        Route::middleware('role:admin,editor')->group(function () {
            // Dashboard
            Route::get('/', function () {
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
                    ],
                ]);
            })->name('dashboard');

            // Law Firms
            Route::resource('law-firms', AdminLawFirmController::class)
                ->names('law-firms');

            // Practice Areas
            Route::resource('practice-areas', PracticeAreaController::class)
                ->names('practice-areas')
                ->except(['show']);

            // Job Listings
            Route::resource('job-listings', AdminJobListingController::class)
                ->names('job-listings')
                ->except(['show']);

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
        });
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
