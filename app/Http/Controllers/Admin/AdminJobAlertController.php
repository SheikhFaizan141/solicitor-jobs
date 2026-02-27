<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobAlertDeliveryItem;
use App\Models\JobAlertSubscription;
use App\Models\Location;
use App\Models\PracticeArea;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminJobAlertController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('admin.job-alerts.dashboard');
    }

    public function dashboard(): Response
    {
        $windowStart = now()->subDays(30);

        return Inertia::render('admin/job-alerts/dashboard', [
            'stats' => $this->buildStats($windowStart),
        ]);
    }

    public function subscriptions(Request $request): Response
    {
        $windowStart = now()->subDays(30);
        $subscriptions = $this->baseSubscriptionsQuery($request, $windowStart)
            ->paginate(5)
            ->withQueryString();

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        return Inertia::render('admin/job-alerts/subscriptions', [
            'subscriptions' => $subscriptions,
            'filters' => [
                'search' => $request->search,
                'frequency' => $request->frequency,
                'is_active' => $request->is_active,
                'location_id' => $request->location_id,
                'practice_area_id' => $request->practice_area_id,
                'rank_bucket' => $request->rank_bucket,
                'strategy' => $request->strategy,
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

    private function baseSubscriptionsQuery(Request $request, Carbon $windowStart): Builder
    {
        $query = JobAlertSubscription::query()
            ->with(['user:id,name,email', 'location:id,name,region,country', 'practiceAreas:id,name'])
            ->withCount('clicks');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function (Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('frequency')) {
            $query->where('frequency', $request->frequency);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('practice_area_id')) {
            $query->whereHas('practiceAreas', function (Builder $q) use ($request): void {
                $q->where('practice_areas.id', $request->practice_area_id);
            });
        }

        if ($request->filled('rank_bucket') && in_array($request->rank_bucket, ['top3', 'rest'], true)) {
            $query->whereHas('deliveryItems', function (Builder $q) use ($request, $windowStart): void {
                $q->where('delivered_at', '>=', $windowStart)
                    ->when(
                        $request->rank_bucket === 'top3',
                        fn (Builder $qq) => $qq->where('rank_position', '<=', 3),
                        fn (Builder $qq) => $qq->where('rank_position', '>', 3),
                    );
            });
        }

        if ($request->filled('strategy') && in_array($request->strategy, ['personalized', 'baseline'], true)) {
            $isPersonalized = $request->strategy === 'personalized';
            $query->whereHas('deliveryItems', function (Builder $q) use ($windowStart, $isPersonalized): void {
                $q->where('delivered_at', '>=', $windowStart)
                    ->where('is_personalized', $isPersonalized);
            });
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $allowedSorts = ['created_at', 'last_sent_at', 'sent_count', 'click_count', 'failed_count'];

        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        return $query;
    }

    private function buildStats(Carbon $windowStart): array
    {
        $deliveryBase = JobAlertDeliveryItem::query()->where('delivered_at', '>=', $windowStart);

        return [
            'total_active' => JobAlertSubscription::where('is_active', true)->count(),
            'total_inactive' => JobAlertSubscription::where('is_active', false)->count(),
            'daily_alerts' => JobAlertSubscription::where('frequency', 'daily')->where('is_active', true)->count(),
            'weekly_alerts' => JobAlertSubscription::where('frequency', 'weekly')->where('is_active', true)->count(),
            'total_sent' => JobAlertSubscription::sum('sent_count'),
            'total_clicks' => JobAlertSubscription::sum('click_count'),
            'avg_click_rate' => $this->calculateAverageClickRate(),
            'ctr_top_3' => $this->calculateCtr(clone $deliveryBase, 'top3'),
            'ctr_rest' => $this->calculateCtr(clone $deliveryBase, 'rest'),
            'apply_rate_from_alerts' => $this->calculateApplyRate(clone $deliveryBase),
            'personalized_vs_baseline_lift' => $this->calculatePersonalizationLift(clone $deliveryBase),
            'trend_last_30_days' => $this->buildTrendSeries($windowStart),
        ];
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

    private function calculateCtr($query, string $bucket): float
    {
        $bucketQuery = $query->when(
            $bucket === 'top3',
            fn ($q) => $q->where('rank_position', '<=', 3),
            fn ($q) => $q->where('rank_position', '>', 3),
        );

        $total = (clone $bucketQuery)->count();
        if ($total === 0) {
            return 0;
        }

        $clicked = (clone $bucketQuery)->whereNotNull('clicked_at')->count();

        return round(($clicked / $total) * 100, 2);
    }

    private function calculateApplyRate($query): float
    {
        $total = (clone $query)->count();
        if ($total === 0) {
            return 0;
        }

        $applies = (clone $query)->whereNotNull('applied_at')->count();

        return round(($applies / $total) * 100, 2);
    }

    private function calculatePersonalizationLift($query): float
    {
        $personalized = (clone $query)->where('is_personalized', true);
        $baseline = (clone $query)->where('is_personalized', false);

        $personalizedTotal = (clone $personalized)->count();
        $baselineTotal = (clone $baseline)->count();

        if ($personalizedTotal === 0 || $baselineTotal === 0) {
            return 0;
        }

        $personalizedCtr = ((clone $personalized)->whereNotNull('clicked_at')->count() / $personalizedTotal) * 100;
        $baselineCtr = ((clone $baseline)->whereNotNull('clicked_at')->count() / $baselineTotal) * 100;

        return round($personalizedCtr - $baselineCtr, 2);
    }

    private function buildTrendSeries(Carbon $windowStart): array
    {
        $aggregates = JobAlertDeliveryItem::query()
            ->selectRaw('DATE(delivered_at) as day')
            ->selectRaw('COUNT(*) as delivered')
            ->selectRaw('SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) as clicked')
            ->selectRaw('SUM(CASE WHEN applied_at IS NOT NULL THEN 1 ELSE 0 END) as applied')
            ->where('delivered_at', '>=', $windowStart)
            ->groupBy(DB::raw('DATE(delivered_at)'))
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $days = [];
        $cursor = $windowStart->copy()->startOfDay();
        $end = now()->startOfDay();

        while ($cursor->lte($end)) {
            $key = $cursor->toDateString();
            $row = $aggregates->get($key);

            $delivered = (int) ($row->delivered ?? 0);
            $clicked = (int) ($row->clicked ?? 0);
            $applied = (int) ($row->applied ?? 0);

            $days[] = [
                'date' => $key,
                'delivered' => $delivered,
                'clicked' => $clicked,
                'applied' => $applied,
                'ctr' => $delivered > 0 ? round(($clicked / $delivered) * 100, 2) : 0,
            ];

            $cursor->addDay();
        }

        return $days;
    }
}
