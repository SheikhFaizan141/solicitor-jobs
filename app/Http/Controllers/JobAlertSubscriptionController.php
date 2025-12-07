<?php

namespace App\Http\Controllers;

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
            'subscriptions' => $user->jobAlertSubscriptions()->with('location')->get(),
            'filterOptions' => [
                'employment_types' => ['full_time', 'part_time', 'contract', 'internship'],
                'practice_areas' => PracticeArea::orderBy('name')->get(['id', 'name']),
                'locations' => Location::where('is_active', true)->orderBy('name')->get(['id', 'name', 'region', 'country', 'is_remote']),
            ]
        ]);
    }

    public function store(Request $request)
    {
        // $this->authorize('update', $request->user());

        $data = $request->validate([
            'frequency' => ['required', 'in:daily,weekly'],
            'employment_types' => ['nullable', 'array'],
            'employment_types.*' => ['in:full_time,part_time,contract,internship'],
            'practice_area_ids' => ['nullable', 'array'],
            'practice_area_ids.*' => ['integer', 'exists:practice_areas,id'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id']
        ]);

        // dd($data);

        $request->user()->jobAlertSubscriptions()->create([
            'frequency' => $data['frequency'],
            'employment_types' => $data['employment_types'] ?? [],
            'practice_area_ids' => $data['practice_area_ids'] ?? [],
            'location_id' => $data['location_id'] ?? null,
            'is_active' => true
        ]);

        return back()->with('success', 'Job alert created.');
    }

    public function destroy(Request $request, JobAlertSubscription $subscription)
    {
        // Gate::authorize('delete', $subscription);

        $subscription->delete();

        return back()->with('success', 'Job alert removed.');
    }
}
