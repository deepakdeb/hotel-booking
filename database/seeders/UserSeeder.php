<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hotelbooking.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
        ]);

        // Create regular user
        User::create([
            'name' => 'Regular User',
            'email' => 'user@hotelbooking.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_USER,
        ]);

        // Create more test users
        User::factory(5)->create(['role' => User::ROLE_USER]);
    }
}