<?php

namespace App\Http\Controllers;

use App\Models\JobAlertClick;
use App\Models\JobAlertDeliveryItem;
use Illuminate\Http\Request;

class JobAlertClickController extends Controller
{
    public function track(Request $request, JobAlertDeliveryItem $deliveryItem)
    {
        if ($request->user() && $request->user()->id !== $deliveryItem->user_id) {
            abort(403);
        }

        $deliveryItem->loadMissing(['subscription', 'jobListing']);
        $subscription = $deliveryItem->subscription;
        $jobListing = $deliveryItem->jobListing;

        if (! $deliveryItem->clicked_at) {
            $clickedAt = now();
            $deliveryItem->forceFill(['clicked_at' => $clickedAt])->save();

            JobAlertClick::create([
                'job_alert_subscription_id' => $subscription->id,
                'job_listing_id' => $jobListing->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'clicked_at' => $clickedAt,
            ]);

            $subscription->incrementClickCount();
        }

        return redirect()->route('jobs.show', $jobListing);
    }
}
