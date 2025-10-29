<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdminJobListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', JobListing::class);

        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'created_at');
        $status = $request->input('status');

        $jobs = JobListing::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('location', 'like', '%' . $search . '%');
            })
            ->when($status === 'active', function ($query) {
                $query->where('is_active', true);
            })
            ->when($status === 'inactive', function ($query) {
                $query->where('is_active', false);
            })
            ->orderBy($sortBy, 'desc')
            ->with('lawFirm')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/job-listings/index', [
            'jobs' => $jobs,
            'can' => [
                'create' => $request->user()->canCreateJobListings(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $this->authorize('create', JobListing::class);
        return Inertia::render('admin/job-listings/create', [
            'firms' => LawFirm::orderBy('name')->get(['id', 'name']),
            'practiceAreas' => PracticeArea::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:job_listings,slug'],
            'law_firm_id' => ['nullable', 'integer', 'exists:law_firms,id'],
            'location' => ['nullable', 'string', 'max:255'],
            'workplace_type' => ['required', 'in:onsite,remote,hybrid'],
            'employment_type' => ['required', 'in:full_time,part_time,contract,internship'],
            'experience_level' => ['nullable', 'string', 'max:255'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'salary_currency' => ['required', 'string', 'size:3'],
            'closing_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string'],
            'practice_areas' => ['nullable', 'array'],
            'practice_areas.*' => ['integer', 'exists:practice_areas,id'],
        ]);

        $jobListing = JobListing::create([
            ...$data,
            'posted_by' => $request->user()->id,
            'published_at' => now(),
        ]);

        $jobListing->practiceAreas()->sync($data['practice_areas'] ?? []);

        return redirect()->route('admin.job-listings.index')->with('success', 'Job listing created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobListing $jobListing)
    {
        return Inertia::render('admin/job-listings/edit', [
            'job' => $jobListing->load('practiceAreas'),
            'firms' => LawFirm::orderBy('name')->get(['id', 'name']),
            'practiceAreas' => PracticeArea::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobListing $jobListing)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:job_listings,slug,' . $jobListing->id],
            'law_firm_id' => ['nullable', 'integer', 'exists:law_firms,id'],
            'location' => ['nullable', 'string', 'max:255'],
            'workplace_type' => ['required', 'in:onsite,remote,hybrid'],
            'employment_type' => ['required', 'in:full_time,part_time,contract,internship'],
            'experience_level' => ['nullable', 'string', 'max:255'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'salary_currency' => ['required', 'string', 'size:3'],
            'closing_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string'],
            'practice_areas' => ['nullable', 'array'],
            'practice_areas.*' => ['integer', 'exists:practice_areas,id'],
        ]);

        $jobListing->update($data);
        $jobListing->practiceAreas()->sync($data['practice_areas'] ?? []);

        return redirect()->route('admin.job-listings.index')->with('success', 'Job listing updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobListing $jobListing)
    {
        $jobListing->delete();
        return back()->with('success', 'Job listing deleted.');
    }
}
