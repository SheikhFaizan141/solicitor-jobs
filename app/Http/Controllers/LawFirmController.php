<?php

namespace App\Http\Controllers;

use App\Models\LawFirm;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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
                'lawFirms' => LawFirm::all(),
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
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['required', 'string', 'max:255', 'unique:law_firms,slug'],
            'description' => ['nullable', 'string'],
            'email'       => ['required', 'email', 'max:255', Rule::unique('law_firms', 'email')],
            'location'    => ['required', 'string', 'max:255'],
            'phone'       => ['required', 'string', 'max:255'],
        ]);

        // dd($data);
        LawFirm::create($data);

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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LawFirm $lawFirm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LawFirm $lawFirm)
    {
        //
    }
}
