<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('admin/index');
    });

    Route::get('/admin/law-firms', function () {
        return Inertia::render('admin/law-firms/index');
    });
});


// require __DIR__.'/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
