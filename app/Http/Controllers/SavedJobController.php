<?php

namespace App\Http\Controllers;

use App\Http\Requests\DestroySavedJobRequest;
use App\Http\Requests\StoreSavedJobRequest;
use App\Http\Requests\UpdateSavedJobNoteRequest;
use App\Models\JobListing;
use App\Models\UserJobInteraction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedJobController extends Controller
{
    public function index(Request $request)
    {
        $savedJobs = $request->user()
            ->savedJobInteractions()
            ->with(['jobListing.lawFirm', 'jobListing.location', 'jobListing.practiceAreas'])
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('app/saved-jobs/index', [
            'savedJobs' => $savedJobs,
        ]);
    }

    public function store(StoreSavedJobRequest $request, JobListing $jobListing)
    {
        UserJobInteraction::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'job_listing_id' => $jobListing->id,
                'type' => UserJobInteraction::TYPE_SAVED,
            ],
            [
                'status' => UserJobInteraction::STATUS_ACTIVE,
            ]
        );

        return back()->with('success', 'Job saved successfully.');
    }

    public function destroy(DestroySavedJobRequest $request, JobListing $jobListing)
    {
        UserJobInteraction::query()
            ->where('user_id', $request->user()->id)
            ->where('job_listing_id', $jobListing->id)
            ->where('type', UserJobInteraction::TYPE_SAVED)
            ->update(['status' => UserJobInteraction::STATUS_ARCHIVED]);

        return back()->with('success', 'Job removed from saved list.');
    }

    public function updateNotes(UpdateSavedJobNoteRequest $request, UserJobInteraction $interaction)
    {
        $savedInteraction = $request->user()
            ->jobInteractions()
            ->whereKey($interaction->id)
            ->where('type', UserJobInteraction::TYPE_SAVED)
            ->where('status', UserJobInteraction::STATUS_ACTIVE)
            ->firstOrFail();

        $savedInteraction->update([
            'notes' => $request->input('notes'),
        ]);

        return back()->with('success', 'Saved job note updated.');
    }
}
