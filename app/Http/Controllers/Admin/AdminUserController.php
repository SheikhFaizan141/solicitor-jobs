<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::query()
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->toDateTimeString(),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => [User::ROLE_ADMIN, User::ROLE_EDITOR, User::ROLE_USER],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/users/create', [
            'roles' => [User::ROLE_EDITOR, User::ROLE_USER],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', Password::min(8)],
            'role' => ['required', Rule::in([User::ROLE_EDITOR, User::ROLE_USER])],
        ]);


        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'roles' => [User::ROLE_ADMIN, User::ROLE_EDITOR, User::ROLE_USER],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        if ($user->id === $request->user()->id && $request->role !== User::ROLE_ADMIN) {
            return back()->withErrors(['role' => 'Cannot demote yourself.']);
        }

        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role'  => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_EDITOR, User::ROLE_USER])],
            'password' => ['nullable', Password::min(8)],
        ]);

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ]);

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        // dd($user->toArray());
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }
}
