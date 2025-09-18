<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\AdminReviewController;

// Review management routes
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

