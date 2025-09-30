<?php

use App\Http\Controllers\Admin\AdminJobListingController;
use App\Http\Controllers\Admin\AdminLawFirmController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\LawFirmController;
use App\Http\Controllers\PracticeAreaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Client-facing routes
Route::get('/', [LawFirmController::class, 'index'])->name('home');
Route::get('/law-firms/{lawFirm:slug}', [LawFirmController::class, 'show'])->name('law-firms.show');

// Review submission route for authenticated users
Route::middleware('auth')->group(function () {
    Route::post('/law-firms/{lawFirm:slug}/reviews', [LawFirmController::class, 'storeReview'])->name('law-firms.reviews.store');
});


/* JOBS */
Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');

Route::get('/jobs/{job:slug}', [JobController::class, 'show'])->name('jobs.show');

// admin facing routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('admin/index');
    });

    Route::resource('/admin/law-firms', AdminLawFirmController::class)
        ->names([
            'index' => 'admin.law-firms.index',
            'create' => 'admin.law-firms.create',
            'store' => 'admin.law-firms.store',
            'show' => 'admin.law-firms.show',
            'edit' => 'admin.law-firms.edit',
            'update' => 'admin.law-firms.update',
            'destroy' => 'admin.law-firms.destroy',
        ]);

    Route::resource('/admin/practice-areas', PracticeAreaController::class)
        ->names('admin.practice-areas')
        ->except(['show']);


    Route::resource('/admin/job-listings', AdminJobListingController::class)
        ->names('admin.job-listings')
        ->except(['show']);


    // Review management routes - properly grouped with correct naming
    Route::prefix('/admin/reviews')->name('admin.reviews.')->group(function () {
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


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
