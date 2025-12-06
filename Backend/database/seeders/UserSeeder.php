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
        DB::table('users')->insert([
            'name' => 'Luxima Admin',
            'email' => 'admin@luxima.com',
            'password' => Hash::make('password'), // Password: password
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Akun Pelanggan (untuk Transaksi)
        DB::table('users')->insert([
            'name' => 'Pelanggan',
            'email' => 'pelanggan@test.com',
            'password' => Hash::make('password'), // Password: password
            'role' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}