<?php

namespace App\Policies;

use App\Models\JobAlertSubscription;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class JobAlertSubscriptionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, JobAlertSubscription $jobAlertSubscription): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JobAlertSubscription $subscription): bool
    {
        // Owner can update own alert
        if ($user->id === $subscription->user_id) {
            return true;
        }

        // Optional: allow privileged users via Spatie permission
        return $user->can('job-alerts.update-any');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JobAlertSubscription $subscription): bool
    {
        // Owner can delete own alert
        if ($user->id === $subscription->user_id) {
            return true;
        }

        // Optional: allow privileged users via Spatie permission
        return $user->can('job-alerts.delete-any');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, JobAlertSubscription $subscription): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, JobAlertSubscription $jobAlertSubscription): bool
    {
        return false;
    }
}
