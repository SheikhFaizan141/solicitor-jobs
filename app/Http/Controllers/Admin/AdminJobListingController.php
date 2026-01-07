<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\LawFirm;
use App\Models\Location;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Stevebauman\Purify\Facades\Purify;

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
                $query->where('title', 'like', '%' . $search . '%');
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


        // return response()->json($jobs);

        return Inertia::render('admin/job-listings/index', [
            'jobs' => $jobs,
        ]);
    }


    public function show(JobListing $jobListing)
    {
        return Inertia::render('admin/job-listings/show', [
            'job' => $jobListing->load(['lawFirm', 'location', 'practiceAreas']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', JobListing::class);

        return Inertia::render('admin/job-listings/create', [
            'firms' => LawFirm::orderBy('name')->get(['id', 'name']),
            'practiceAreas' => PracticeArea::orderBy('name')->get(['id', 'name']),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(['id', 'name', 'region', 'country', 'is_remote']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', JobListing::class);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:job_listings,slug'],
            'law_firm_id' => ['nullable', 'integer', Rule::exists('law_firms', 'id')],
            'location_id' => ['nullable', 'integer', Rule::exists('locations', 'id')],
            'workplace_type' => ['required', Rule::in(['onsite', 'remote', 'hybrid'])],
            'employment_type' => ['required', Rule::in(['full_time', 'part_time', 'contract', 'internship'])],
            'experience_level' => ['nullable', 'string', 'max:255'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'salary_currency' => ['required', 'string', 'size:3'],
            'closing_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'external_link' => ['nullable', 'string', 'url', 'max:2048'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string'],
            'practice_areas' => ['nullable', 'array'],
            'practice_areas.*' => ['integer', Rule::exists('practice_areas', 'id')],
        ]);

        if (!empty($data['description'])) {
            $data['description'] = Purify::clean($data['description']);
        }

        $jobListing = JobListing::create([
            ...$data,
            'posted_by' => $request->user()->id,
            'published_at' => ($data['is_active'] ?? false) ? now() : null,
        ]);

        $jobListing->practiceAreas()->sync($data['practice_areas'] ?? []);

        return redirect()->route('admin.job-listings.index')->with('success', 'Job listing created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobListing $jobListing)
    {
        Gate::authorize('update', $jobListing);

        // format the closing date for the date input field
        $jobData = $jobListing->load(['practiceAreas', 'location'])->toArray();

        if ($jobListing->closing_date) {
            $jobData['closing_date'] = $jobListing->closing_date->format('Y-m-d');
        }

        return Inertia::render('admin/job-listings/edit', [
            'job' => $jobData,
            'firms' => LawFirm::orderBy('name')->get(['id', 'name']),
            'practiceAreas' => PracticeArea::orderBy('name')->get(['id', 'name', 'parent_id']),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(['id', 'name', 'region', 'country', 'is_remote']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobListing $jobListing)
    {
        Gate::authorize('update', $jobListing);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'law_firm_id' => ['nullable', 'integer', Rule::exists('law_firms', 'id')],
            'location_id' => ['nullable', 'integer', Rule::exists('locations', 'id')],
            'workplace_type' => ['required', Rule::in(['onsite', 'remote', 'hybrid'])],
            'employment_type' => ['required', Rule::in(['full_time', 'part_time', 'contract', 'internship'])],
            'experience_level' => ['nullable', 'string', 'max:255'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'salary_currency' => ['required', 'string', 'size:3'],
            'closing_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string', 'max:300'],
            'external_link' => ['nullable', 'string', 'url', 'max:2048'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string'],
            'practice_areas' => ['nullable', 'array'],
            'practice_areas.*' => ['integer', Rule::exists('practice_areas', 'id')],
        ]);

        if (!empty($data['description'])) {
            $data['description'] = Purify::clean($data['description']);
        }

        if (($data['is_active'] ?? false) && is_null($jobListing->published_at)) {
            $data['published_at'] = now();
        }

        $jobListing->update($data);
        $jobListing->practiceAreas()->sync($data['practice_areas'] ?? []);

        return redirect()->route('admin.job-listings.index')->with('success', 'Job listing updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobListing $jobListing)
    {
        Gate::authorize('delete', $jobListing);

        $jobListing->delete();

        return back()->with('success', 'Job listing deleted.');
    }
}
