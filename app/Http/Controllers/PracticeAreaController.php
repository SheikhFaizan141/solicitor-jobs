<?php

namespace App\Http\Controllers;

use App\Models\PracticeArea;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PracticeAreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'name');

        $query = PracticeArea::query()
            ->with(['parent'])
            ->withCount('lawFirms')
            ->when($search, function (Builder $query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            });


        // Sorting
        switch ($sortBy) {
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case '-name':
                $query->orderBy('name', 'desc');
                break;
            case 'firms':
                $query->orderBy('law_firms_count', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
        }

        $areas = $query->paginate(10)->withQueryString();
        return Inertia::render('admin/practice-areas/index', [
            'areas' => $areas,
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
            'name' => ['required', 'string', 'max:255', Rule::unique('practice_areas', 'name')],
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
            if ($p->id === $currentId) {
                return true;
            }
            $p = $p->parent;
        }

        return false;
    }
}
