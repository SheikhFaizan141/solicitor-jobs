<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create roles first
        Role::findOrCreate(User::ROLE_ADMIN, 'web');
        Role::findOrCreate(User::ROLE_EDITOR, 'web');
        Role::findOrCreate(User::ROLE_USER, 'web');

        // Migrate existing users' roles to Spatie
        $users = DB::table('users')->select('id', 'role')->get();

        foreach ($users as $user) {
            $roleName = $user->role ?: User::ROLE_USER;
            $userModel = User::find($user->id);
            $userModel?->assignRole($roleName);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse: copy Spatie roles back to role column
        $users = User::with('roles')->get();

        foreach ($users as $user) {
            $roleName = $user->roles->first()?->name ?? User::ROLE_USER;
            DB::table('users')
                ->where('id', $user->id)
                ->update(['role' => $roleName]);
        }

        // Remove all role assignments
        DB::table('model_has_roles')->where('model_type', User::class)->delete();
    }
};
