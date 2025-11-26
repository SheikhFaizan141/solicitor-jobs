<?php

namespace App\Http\Controllers;

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
        $practiceArea = $request->input('practice_area');
        $sort = $request->input('sort');

        $query = LawFirm::with(['contacts', 'reviews', 'practiceAreas']);

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        // if ($practiceArea) {
        //     $lawFirm = $lawFirm->whereHas('practiceAreas', fn($query) => $query->where('id', $practiceArea));
        // }

        // if ($sort) {
        //     $lawFirm = $lawFirm->orderBy('rating', $sort === 'high' ? 'desc' : 'asc');
        // }

        // $lawFirm = LawFirm::latest()->with(['contacts', 'reviews', 'practiceAreas'])->paginate(18);

        $lawFirms = $query->paginate(18)->withQueryString();

        return Inertia::render('law-firms/index', [
            'lawFirms' => $lawFirms,
            'practiceAreas' => PracticeArea::whereNull('parent_id')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'practice_area', 'sort']), // Pass current filters back
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(LawFirm $lawFirm)
    {
        $reviews = $lawFirm->reviews()
            ->where('status', 'active')
            ->with('user')
            ->latest()->paginate(10);

        return Inertia::render('law-firms/show', [
            'lawFirm' => $lawFirm->load(['contacts', 'reviews']),
            'reviews' => $reviews,
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
