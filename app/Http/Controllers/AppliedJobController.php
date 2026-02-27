<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppliedJobRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Models\JobAlertDeliveryItem;
use App\Models\JobListing;
use App\Models\UserJobInteraction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppliedJobController extends Controller
{
    public function index(Request $request)
    {
        $appliedJobs = $request->user()
            ->appliedJobInteractions()
            ->with(['jobListing.lawFirm', 'jobListing.location', 'jobListing.practiceAreas'])
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('app/applied-jobs/index', [
            'appliedJobs' => $appliedJobs,
        ]);
    }

    public function store(StoreAppliedJobRequest $request, JobListing $jobListing)
    {
        $user = $request->user();

        UserJobInteraction::updateOrCreate(
            [
                'user_id' => $user->id,
                'job_listing_id' => $jobListing->id,
                'type' => UserJobInteraction::TYPE_APPLIED,
            ],
            [
                'status' => UserJobInteraction::STATUS_ACTIVE,
                'metadata' => [
                    'application_status' => UserJobInteraction::APPLICATION_STATUS_APPLIED,
                    'applied_at' => now()->toISOString(),
                ],
            ]
        );

        $windowDays = max((int) config('smart-alerts.attribution_window_days', 7), 1);
        $recentDeliveryItem = JobAlertDeliveryItem::query()
            ->where('user_id', $user->id)
            ->where('job_listing_id', $jobListing->id)
            ->whereNotNull('clicked_at')
            ->whereNull('applied_at')
            ->where('clicked_at', '>=', now()->subDays($windowDays))
            ->latest('clicked_at')
            ->first();

        if ($recentDeliveryItem) {
            $recentDeliveryItem->forceFill(['applied_at' => now()])->save();
        }

        return back()->with('success', 'Application tracked successfully.');
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, UserJobInteraction $interaction)
    {
        $appliedInteraction = $request->user()
            ->jobInteractions()
            ->whereKey($interaction->id)
            ->where('type', UserJobInteraction::TYPE_APPLIED)
            ->where('status', UserJobInteraction::STATUS_ACTIVE)
            ->firstOrFail();

        $appliedInteraction->update([
            'metadata' => array_merge($appliedInteraction->metadata ?? [], [
                'application_status' => $request->input('application_status'),
            ]),
        ]);

        return back()->with('success', 'Application status updated.');
    }

    public function destroy(Request $request, UserJobInteraction $interaction)
    {
        $request->user()
            ->jobInteractions()
            ->whereKey($interaction->id)
            ->where('type', UserJobInteraction::TYPE_APPLIED)
            ->firstOrFail()
            ->update(['status' => UserJobInteraction::STATUS_ARCHIVED]);

        return back()->with('success', 'Application removed.');
    }
}
