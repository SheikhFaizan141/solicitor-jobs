<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LawFirm;
use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminLawFirmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sort_by', 'created_at');
        $statusFilter = $request->input('status');

        $query = LawFirm::query()
            ->with('contacts')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhere('website', 'like', '%' . $search . '%');
            })
            ->when($statusFilter === 'active', function ($query) {
                // Add your active condition if you have an is_active column
                // $query->where('is_active', true);
            })
            ->when($statusFilter === 'inactive', function ($query) {
                // Add your inactive condition
                // $query->where('is_active', false);
            });


        // Sorting
        switch ($sortBy) {
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case '-name':
                $query->orderBy('name', 'desc');
                break;
            case 'location':
                // Assuming you have a location column
                $query->orderBy('location', 'asc');
                break;
            default:
                $query->latest();
        }

        $lawFirms = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/law-firms/index', [
            'lawFirms' => $lawFirms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/law-firms/create', [
            'practiceAreas' => PracticeArea::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:law_firms,slug'],
            'description' => ['nullable', 'string'],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg,webp', 'max:512'], // 512KB
            'practice_areas' => ['nullable', 'array'],
            'practice_areas.*' => ['integer', 'exists:practice_areas,id'],
            'contacts' => ['nullable', 'array'],
            'contacts.*.label' => ['nullable', 'string', 'max:255'],
            'contacts.*.address' => ['nullable', 'string'],
            'contacts.*.email' => ['nullable', 'email', 'max:255'],
            'contacts.*.phone' => ['nullable', 'string', 'max:255'],
        ]);

        if (blank($data['slug'] ?? null)) {
            unset($data['slug']);
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('firm_logos', 'public');
        }

        $practiceAreas = $data['practice_areas'] ?? [];
        $contacts = $data['contacts'] ?? [];
        unset($data['practice_areas'], $data['contacts'], $data['logo']);

        $lawFirm = LawFirm::create($data);

        if ($practiceAreas) {
            $lawFirm->practiceAreas()->sync($practiceAreas);
        }

        foreach ($contacts as $c) {
            if (
                blank($c['label'] ?? null) && blank($c['address'] ?? null) &&
                blank($c['email'] ?? null) && blank($c['phone'] ?? null)
            ) {
                continue;
            }
            $lawFirm->contacts()->create($c);
        }

        return redirect()->route('admin.law-firms.index')->with('success', 'Law firm created.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LawFirm $lawFirm)
    {
        $lawFirm->load('contacts', 'practiceAreas');

        return Inertia::render('admin/law-firms/edit', [
            'lawFirm' => $lawFirm,
            'practiceAreas' => PracticeArea::orderBy('name')->get(),
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
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg,webp', 'max:512'], // 512KB
            'remove_logo' => ['nullable', 'boolean'], // flag to remove existing logo
            'practice_areas' => ['nullable', 'array'],
            'practice_areas.*' => ['integer', 'exists:practice_areas,id'],
            'contacts' => ['nullable', 'array'],
            'contacts.*.label' => ['nullable', 'string', 'max:255'],
            'contacts.*.address' => ['nullable', 'string'],
            'contacts.*.email' => ['nullable', 'email', 'max:255'],
            'contacts.*.phone' => ['nullable', 'string', 'max:255'],
        ]);

        if (blank($data['slug'] ?? null)) {
            unset($data['slug']);
        }

        // Handle logo removal
        if ($request->boolean('remove_logo') && $lawFirm->logo_path) {
            Storage::disk('public')->delete($lawFirm->logo_path);
            $data['logo_path'] = null;
        }

        // Handle new logo upload
        if ($request->hasFile('logo')) {
            if ($lawFirm->logo_path) {
                Storage::disk('public')->delete($lawFirm->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('firm_logos', 'public');
        }

        $practiceAreas = $data['practice_areas'] ?? [];
        $contacts = $data['contacts'] ?? [];
        unset($data['practice_areas'], $data['contacts'], $data['logo'], $data['remove_logo']);

        $lawFirm->update($data);

        // Sync practice areas
        if (isset($practiceAreas)) {
            $lawFirm->practiceAreas()->sync($practiceAreas);
        }

        // Replace contacts
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
}
