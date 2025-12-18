<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobAlertSubscription;
use App\Models\Location;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminJobAlertController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JobAlertSubscription::query()
            ->with(['user:id,name,email', 'location:id,name,region,country', 'practiceAreas:id,name'])
            ->withCount('clicks');

        // Search by user name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by frequency
        if ($request->filled('frequency')) {
            $query->where('frequency', $request->frequency);
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by location
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        // Filter by practice area
        if ($request->filled('practice_area_id')) {
            $query->whereHas('practiceAreas', function ($q) use ($request) {
                $q->where('practice_areas.id', $request->practice_area_id);
            });
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $allowedSorts = ['created_at', 'last_sent_at', 'sent_count', 'click_count', 'failed_count'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $subscriptions = $query->paginate(5)->withQueryString();

        // Calculate stats
        $stats = [
            'total_active' => JobAlertSubscription::where('is_active', true)->count(),
            'total_inactive' => JobAlertSubscription::where('is_active', false)->count(),
            'daily_alerts' => JobAlertSubscription::where('frequency', 'daily')->where('is_active', true)->count(),
            'weekly_alerts' => JobAlertSubscription::where('frequency', 'weekly')->where('is_active', true)->count(),
            'total_sent' => JobAlertSubscription::sum('sent_count'),
            'total_clicks' => JobAlertSubscription::sum('click_count'),
            'avg_click_rate' => $this->calculateAverageClickRate(),
        ];

        return Inertia::render('admin/job-alerts/index', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'frequency' => $request->frequency,
                'is_active' => $request->is_active,
                'location_id' => $request->location_id,
                'practice_area_id' => $request->practice_area_id,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
            'locations' => Location::orderBy('name')->get(['id', 'name', 'region', 'country']),
            'practiceAreas' => PracticeArea::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, JobAlertSubscription $jobAlert)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $jobAlert->update($validated);

        return back()->with('success', 'Job alert updated successfully.');
    }

    public function destroy(JobAlertSubscription $jobAlert)
    {
        $jobAlert->delete();

        return back()->with('success', 'Job alert deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:job_alert_subscriptions,id',
        ]);

        JobAlertSubscription::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Job alerts deleted successfully.');
    }

    public function bulkToggle(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:job_alert_subscriptions,id',
            'is_active' => 'required|boolean',
        ]);

        JobAlertSubscription::whereIn('id', $validated['ids'])
            ->update(['is_active' => $validated['is_active']]);

        $status = $validated['is_active'] ? 'activated' : 'deactivated';
        return back()->with('success', "Job alerts {$status} successfully.");
    }

    private function calculateAverageClickRate(): float
    {
        $subscriptions = JobAlertSubscription::where('sent_count', '>', 0)->get();

        if ($subscriptions->isEmpty()) {
            return 0;
        }

        $totalRate = $subscriptions->sum(function ($sub) {
            return $sub->getClickThroughRate();
        });

        return round($totalRate / $subscriptions->count(), 2);
    }
}
