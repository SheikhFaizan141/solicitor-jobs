<?php

namespace App\Providers;

use App\Models\JobListing;
use App\Models\User;
use App\Policies\JobListingPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        //  Gate::policy(JobListing::class, JobListingPolicy::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin', fn (User $user) => $user->isAdmin());

        Gate::define('staff', fn (User $user) => $user->isStaff());
    }
}
