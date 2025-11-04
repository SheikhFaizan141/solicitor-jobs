<?php

namespace App\Http\Controllers;

use App\Models\LawFirm;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
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

        return Inertia::render('home', [
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
     * Show the form for editing the specified resource.
     */
    public function edit(LawFirm $lawFirm)
    {
        return Inertia::render('admin/law-firms/edit', [
            'lawFirm' => $lawFirm,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LawFirm $lawFirm)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('law_firms', 'slug')->ignore($lawFirm->id)],
            'description' => ['nullable', 'string'],
            'email' => ['required', 'email', 'max:255', Rule::unique('law_firms', 'email')->ignore($lawFirm->id)],
            'location' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],

            // logo upload
            'logo' => ['nullable', 'image', 'max:5120'],

            // contacts
            'contacts' => ['nullable', 'array'],
            'contacts.*.label' => ['nullable', 'string', 'max:255'],
            'contacts.*.address' => ['nullable', 'string'],
            'contacts.*.email' => ['nullable', 'email', 'max:255'],
            'contacts.*.phone' => ['nullable', 'string', 'max:255'],
        ]);

        if (blank($data['slug'] ?? null)) {
            unset($data['slug']); // preserve existing slug if field cleared
        }

        // Handle logo upload and removal of previous
        if ($request->hasFile('logo')) {
            if ($lawFirm->logo_path) {
                Storage::disk('public')->delete($lawFirm->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('law_firm_logos', 'public');
        }

        $contacts = $data['contacts'] ?? [];
        unset($data['contacts'], $data['logo']);

        $lawFirm->update($data);

        // Replace contacts: simple strategy delete all and recreate
        if (! empty($contacts)) {
            $lawFirm->contacts()->delete();
            foreach ($contacts as $c) {
                if (blank($c['label'] ?? null) && blank($c['address'] ?? null) && blank($c['email'] ?? null) && blank($c['phone'] ?? null)) {
                    continue;
                }
                $lawFirm->contacts()->create($c);
            }
        }

        return redirect()
            ->route('admin.law-firms.index')
            ->with('success', 'Law firm updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LawFirm $lawFirm)
    {
        $lawFirm->delete();

        return redirect()
            ->route('admin.law-firms.index')
            ->with('success', 'Law firm deleted successfully.');
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
