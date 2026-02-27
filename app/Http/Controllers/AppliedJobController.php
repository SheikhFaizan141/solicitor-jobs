<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppliedJobRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
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
        UserJobInteraction::updateOrCreate(
            [
                'user_id' => $request->user()->id,
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
