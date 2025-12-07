<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use BackedEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Location::class);

        $search = $request->input('search');
        $sortInput = $request->input('sort_by', 'name'); // e.g. "name", "-name", "created_at", "-created_at"

        // Determine sort field and order based on prefix
        if (str_starts_with($sortInput, '-')) {
            $sortBy = ltrim($sortInput, '-');
            $sortOrder = 'desc';
        } else {
            $sortBy = $sortInput;
            $sortOrder = 'asc';
        }

        $locations = Location::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('slug', 'like', '%' . $search . '%');
                });
            })
            ->withCount('jobListings')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/locations/index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Location::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('locations', 'name')],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('locations', 'slug')],
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        Location::create($data);

        return back()->with('success', 'Location created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        Gate::authorize('update', Location::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('locations', 'name')->ignore($location->id)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('locations', 'slug')->ignore($location->id)],
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $location->update($data);

        return back()->with('success', 'Location updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        Gate::authorize('delete', $location);

        $location->delete();

        return back()->with('success', 'Location deleted successfully.');
    }
}
