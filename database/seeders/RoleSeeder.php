<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        Role::findOrCreate(User::ROLE_ADMIN, 'web');
        Role::findOrCreate(User::ROLE_EDITOR, 'web');
        Role::findOrCreate(User::ROLE_USER, 'web');
    }
}
