<?php

namespace App\Http\Controllers;

use App\Models\LawFirm;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LawFirmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render(
            'admin/law-firms/index',
            [
                'lawFirms' => LawFirm::with('contacts')->get(),
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/law-firms/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],

            // slug optional; if provided must be unique (for now we dont't allow editing later we might require it)
            'slug'        => ['nullable', 'string', 'max:255', 'unique:law_firms,slug'],
            'description' => ['nullable', 'string'],

            // logo upload (optional)
            'logo'        => ['nullable', 'image', 'max:5120'], // max 5MB

            // contacts array
            'contacts'           => ['nullable', 'array'],
            'contacts.*.label'   => ['nullable', 'string', 'max:255'],
            'contacts.*.address' => ['nullable', 'string'],
            'contacts.*.email'   => ['nullable', 'email', 'max:255'],
            'contacts.*.phone'   => ['nullable', 'string', 'max:255'],
        ]);

        // If slug is blank/null remove it so model hook can create one.
        if (blank($data['slug'] ?? null)) {
            unset($data['slug']);
        }

        // Handle logo upload if present
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('law_firm_logos', 'public');
        }

        $contacts = $data['contacts'] ?? [];
        unset($data['contacts'], $data['logo']);

        $lawFirm = LawFirm::create($data);

        // Persist contacts (skip completely blank entries)
        foreach ($contacts as $c) {
            if (blank($c['label'] ?? null) && blank($c['address'] ?? null) && blank($c['email'] ?? null) && blank($c['phone'] ?? null)) {
                continue;
            }
            $lawFirm->contacts()->create($c);
        }

        return redirect()->route('admin.law-firms.index')->with('success', 'Law firm created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LawFirm $lawFirm)
    {
        //
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
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', Rule::unique('law_firms', 'slug')->ignore($lawFirm->id)],
            'description' => ['nullable', 'string'],
            'email'       => ['required', 'email', 'max:255', Rule::unique('law_firms', 'email')->ignore($lawFirm->id)],
            'location'    => ['required', 'string', 'max:255'],
            'phone'       => ['required', 'string', 'max:255'],

            // logo upload
            'logo'        => ['nullable', 'image', 'max:5120'],

            // contacts
            'contacts'           => ['nullable', 'array'],
            'contacts.*.label'   => ['nullable', 'string', 'max:255'],
            'contacts.*.address' => ['nullable', 'string'],
            'contacts.*.email'   => ['nullable', 'email', 'max:255'],
            'contacts.*.phone'   => ['nullable', 'string', 'max:255'],
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
}
