<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LawFirm;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    /**
     * Display the main reviews dashboard
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'lawFirm'])
            ->active()
            ->latest();

        $query = $this->applyFilters($query, $request);

        $reviews = $query->paginate(20)->withQueryString();

        return $this->renderReviewsPage('active', $reviews, $request);
    }

    /**
     * Display spam reviews
     */
    public function spam(Request $request)
    {
        $query = Review::with(['user', 'lawFirm'])
            ->spam()
            ->latest();

        $query = $this->applyFilters($query, $request);

        $reviews = $query->paginate(20)->withQueryString();

        return $this->renderReviewsPage('spam', $reviews, $request);
    }

    /**
     * Display trashed reviews
     */
    public function trash(Request $request)
    {
        $query = Review::with(['user', 'lawFirm'])
            ->onlyTrashed()
            ->latest();

        $query = $this->applyFilters($query, $request);

        $reviews = $query->paginate(20)->withQueryString();

        return $this->renderReviewsPage('trash', $reviews, $request);
    }

    /**
     * Mark review as spam
     */
    public function markAsSpam(Review $review)
    {
        $review->markAsSpam();

        return back()->with('success', 'Review marked as spam.');
    }

    /**
     * Move review to trash
     */
    public function moveToTrash(Review $review)
    {
        $review->moveToTrash();

        return back()->with('success', 'Review moved to trash.');
    }

    /**
     * Restore review to active status
     */
    public function restore($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->markAsActive();

        return back()->with('success', 'Review restored.');
    }

    /**
     * Permanently delete review
     */
    public function forceDelete($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->forceDelete();

        return back()->with('success', 'Review permanently deleted.');
    }

    /**
     * Bulk actions
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:spam,trash,restore,delete,activate',
            'reviews' => 'required|array',
            'reviews.*' => 'exists:reviews,id',
        ]);

        $reviewIds = $request->reviews;
        $action = $request->action;

        switch ($action) {
            case 'spam':
                Review::whereIn('id', $reviewIds)->update(['status' => 'spam']);
                $message = 'Reviews marked as spam.';
                break;

            case 'trash':
                Review::whereIn('id', $reviewIds)->each(function ($review) {
                    $review->moveToTrash();
                });
                $message = 'Reviews moved to trash.';
                break;

            case 'restore':
                Review::withTrashed()->whereIn('id', $reviewIds)->each(function ($review) {
                    $review->markAsActive();
                });
                $message = 'Reviews restored.';
                break;

            case 'delete':
                Review::withTrashed()->whereIn('id', $reviewIds)->forceDelete();
                $message = 'Reviews permanently deleted.';
                break;

            case 'activate':
                Review::whereIn('id', $reviewIds)->update(['status' => 'active']);
                $message = 'Reviews marked as active.';
                break;
        }

        return back()->with('success', $message);
    }

    /**
     * Apply filters to query
     */
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('rating') && $request->rating !== 'all') {
            $query->byRating($request->rating);
        }

        if ($request->filled('law_firm') && $request->law_firm !== 'all') {
            $query->byLawFirm($request->law_firm);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->dateRange(
                Carbon::parse($request->start_date),
                Carbon::parse($request->end_date)
            );
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('lawFirm', function ($firmQuery) use ($search) {
                        $firmQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'latest':
                    $query->latest();
                    break;
                case 'oldest':
                    $query->oldest();
                    break;
                case 'rating_high':
                    $query->orderBy('rating', 'desc');
                    break;
                case 'rating_low':
                    $query->orderBy('rating', 'asc');
                    break;
                default:
                    $query->latest();
            }
        }

        return $query;
    }

    /**
     * Render reviews page with common data
     */
    private function renderReviewsPage($activeTab, $reviews, Request $request)
    {
        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'activeTab' => $activeTab,
            'filters' => $request->only(['rating', 'law_firm', 'start_date', 'end_date', 'search', 'sort']),
            'lawFirms' => LawFirm::select('id', 'name')->orderBy('name')->get(),
            'stats' => [
                'active' => Review::active()->count(),
                'spam' => Review::spam()->count(),
                'trash' => Review::onlyTrashed()->count(),
            ],
        ]);
    }
}
