<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        // Pastikan admin belum login
        if (Auth::check() && Auth::user()->isAdmin()) {
            return redirect()->route('admin.dashboard'); 
        }
        return view('admin.auth.login');
    }

    // Logika proses login
    public function login(Request $request)
    {
        // Validasi Input
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Coba Otentikasi
        if (Auth::attempt($credentials)) {
            // Cek role
            if (Auth::user()->isAdmin()) {
                $request->session()->regenerate();
                return redirect()->intended(route('admin.dashboard')); 
            }

            // Jika role bukan admin, logout dan berikan error
            Auth::logout();
            return back()->withErrors(['email' => 'Akses ditolak. Akun bukan Admin.']);
        }

        // Gagal Otentikasi
        return back()->withErrors(['email' => 'Kombinasi Email dan Password salah.']);
    }

    // Logika logout
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/'); // Arahkan ke halaman utama
    }
}
