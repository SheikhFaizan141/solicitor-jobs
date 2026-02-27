<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LawFirmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $practiceAreaId = $request->input('practice_area');
        $sort = $request->input('sort', 'latest');

        $query = LawFirm::with(['contacts', 'practiceAreas'])
            ->active()
            ->withCount('activeReviews as reviews_count')
            ->withAvg('activeReviews as average_rating', 'rating')
            ->withCount(['jobs as jobs_count' => fn ($q) => $q->active()->open()]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
                // ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($practiceAreaId) {
            $query->whereHas('practiceAreas', function ($q) use ($practiceAreaId) {
                $q->where('practice_areas.id', $practiceAreaId);
            });
        }

        switch ($sort) {
            case 'high':
                $query->orderByDesc('average_rating');
                break;
            case 'low':
                $query->orderBy('average_rating');
                break;
            case 'name':
                $query->orderBy('name');
                break;
            default:
                $query->latest();
                break;
        }

        $lawFirms = $query->paginate(18)->withQueryString();

        return Inertia::render('law-firms/index', [
            'lawFirms' => $lawFirms,
            'practiceAreas' => PracticeArea::whereNull('parent_id')
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'search' => $request->input('search'),
                'practice_area' => $request->input('practice_area'),
                'sort' => $request->input('sort'),
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(LawFirm $lawFirm)
    {
        abort_if(! $lawFirm->is_active, 404);

        $reviews = $lawFirm->reviews()
            ->active()
            ->with('user')
            ->latest()->paginate(10);

        $jobs = $lawFirm->jobs()
            ->active()
            ->open()
            ->latest()
            ->with('location')
            ->paginate(5)
            ->through(function (JobListing $job): array {
                $location = $job->getRelation('location')?->name;

                return [
                    'id' => $job->id,
                    'slug' => $job->slug,
                    'title' => $job->title,
                    'location' => $location ?? $job->location,
                    'excerpt' => $job->excerpt,
                    'employment_type' => $job->employment_type,
                    'published_at' => $job->published_at?->toDateString(),
                ];
            });

        return Inertia::render('law-firms/show', [
            'lawFirm' => $lawFirm->load(['contacts', 'practiceAreas']),
            'reviews' => $reviews,
            'jobs' => $jobs,
        ]);
    }

    /**
     * Store a review for the law firm.
     */
    public function storeReview(Request $request, LawFirm $lawFirm)
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        // Check if user has already reviewed this law firm
        $existingReview = $lawFirm->reviews()
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this law firm.');
        }

        $lawFirm->reviews()->create([
            'user_id' => $request->user()->id,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
            'status' => 'active',
        ]);

        return back()->with('success', 'Thank you for your review!');
    }
}
