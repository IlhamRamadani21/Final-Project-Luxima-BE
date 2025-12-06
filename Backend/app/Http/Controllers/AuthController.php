<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Menangani proses login user dan menghasilkan token Sanctum.
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Mencari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // 3. Verifikasi kredensial
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang Anda masukkan salah.'],
            ]);
        }
        
        // Opsional: Cek role jika hanya admin yang boleh login di endpoint ini
        // if (!$user->isAdmin()) {
        //     return response()->json([
        //         'message' => 'Akses ditolak. Hanya Admin yang diizinkan.'
        //     ], 403); 
        // }

        // 4. Hapus token lama dan buat token baru
        // Ini memastikan hanya 1 token yang aktif per perangkat
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Berhasil Login
        return response()->json([
            'message' => 'Login berhasil!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Menangani proses registrasi user baru.
     */
    public function register(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // 2. Buat User Baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Kembalikan Respon Sukses
        return response()->json([
            'message' => 'Registrasi berhasil! Silakan login.',
            'user' => $user
        ], 201);
    }

    /**
     * Menangani proses logout user (menghapus token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil. Token telah dicabut.']);
    }
}