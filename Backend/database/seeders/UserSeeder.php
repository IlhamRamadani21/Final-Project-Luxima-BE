<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Akun Admin
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@luxima.com'], // Cek berdasarkan email biar engga duplikat
            [
                'name' => 'Luxima Admin',
                'password' => Hash::make('admin12345'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Akun Pelanggan
        DB::table('users')->updateOrInsert(
            ['email' => 'pelanggan@test.com'],
            [
                'name' => 'Pelanggan',
                'password' => Hash::make('Pelanggan12345'),
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
