<?php

namespace App\Http\Controllers;

use App\Models\JobAlertClick;
use App\Models\JobAlertSubscription;
use App\Models\JobListing;
use Illuminate\Http\Request;

class JobAlertClickController extends Controller
{
    public function track(Request $request)
    {
        $validated = $request->validate([
            'alert_id' => 'required|exists:job_alert_subscriptions,id',
            'job_id' => 'required|exists:job_listings,id',
        ]);

        $subscription = JobAlertSubscription::findOrFail($validated['alert_id']);
        $jobListing = JobListing::findOrFail($validated['job_id']);

        // Record the click
        JobAlertClick::create([
            'job_alert_subscription_id' => $subscription->id,
            'job_listing_id' => $jobListing->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'clicked_at' => now(),
        ]);

        // Increment click count
        $subscription->incrementClickCount();
        // Redirect to the job listing
        return redirect()->route('jobs.show', $jobListing);
    }
}
