<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobAlertSubscriptionRequest;
use App\Models\JobAlertSubscription;
use App\Models\Location;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class JobAlertSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('job-alerts/index', [
            'subscriptions' => $user->jobAlertSubscriptions()->with(['location', 'practiceAreas'])->get(),
            'filterOptions' => [
                'employment_types' => ['full_time', 'part_time', 'contract', 'internship'],
                'practice_areas' => PracticeArea::orderBy('name')->get(['id', 'name']),
                'locations' => Location::where('is_active', true)->orderBy('name')->get(['id', 'name', 'region', 'country', 'is_remote']),
            ],
        ]);
    }

    public function store(StoreJobAlertSubscriptionRequest $request)
    {
        $data = $request->validated();

        $subscription = $request->user()->jobAlertSubscriptions()->create([
            'frequency' => $data['frequency'],
            'employment_types' => $data['employment_types'] ?? null,
            'location_id' => $data['location_id'] ?? null,
            'is_active' => true,
        ]);

        if (! empty($data['practice_area_ids'])) {
            $subscription->practiceAreas()->sync($data['practice_area_ids']);
        }

        return back()->with('success', 'Job alert created successfully!');
    }

    public function destroy(Request $request, JobAlertSubscription $subscription)
    {
        // Gate::authorize('delete', $subscription);

        $subscription->delete();

        return back()->with('success', 'Job alert removed.');
    }
}
