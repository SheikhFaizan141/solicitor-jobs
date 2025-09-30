<?php

namespace App\Http\Controllers;

use App\Models\PracticeArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PracticeAreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/practice-areas/index', [
            'areas' => PracticeArea::with(['parent'])->withCount('lawFirms')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/practice-areas/create', [
            'parents' => PracticeArea::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:practice_areas,name'],
            'parent_id' => ['nullable', 'integer', 'exists:practice_areas,id'],
        ]);

        PracticeArea::create($data);

        return redirect()->route('admin.practice-areas.index')->with('success', 'Practice area created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PracticeArea $practiceArea)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PracticeArea $practiceArea)
    {
        return Inertia::render('admin/practice-areas/edit', [
            'practiceArea' => $practiceArea,
            'parents' => PracticeArea::where('id', '!=', $practiceArea->id)->orderBy('name')->get(),
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PracticeArea $practiceArea)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:practice_areas,name,' . $practiceArea->id],
            'parent_id' => ['nullable', 'integer', 'different:id', 'exists:practice_areas,id'],
        ]);

        // Prevent cycles
        if (($data['parent_id'] ?? null) && $this->wouldCauseCycle($practiceArea->id, $data['parent_id'])) {
            return back()->withErrors(['parent_id' => 'Invalid parent (cycle).']);
        }

        $practiceArea->update($data);

        return redirect()->route('admin.practice-areas.index')->with('success', 'Updated.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PracticeArea $practiceArea)
    {
        $practiceArea->delete();
        return redirect()->route('admin.practice-areas.index')->with('success', 'Deleted.');
    }

    private function wouldCauseCycle(int $currentId, int $newParentId): bool
    {
        $p = PracticeArea::find($newParentId);
        while ($p) {
            if ($p->id === $currentId) return true;
            $p = $p->parent;
        }
        return false;
    }
}
