<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\PaymentVerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard (Tujuan setelah login berhasil)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rute untuk Halaman Verifikasi Pembayaran (F-12)
    Route::get('/verifications', [PaymentVerificationController::class, 'index'])->name('verifications.index');
    Route::get('/verifications/{transaction}', [PaymentVerificationController::class, 'show'])->name('verifications.show');
    Route::post('/verifications/{transaction}/verify', [PaymentVerificationController::class, 'verify'])->name('verifications.verify');
    
});

// --- Rute Login/Logout Admin (Publik) ---
Route::get('/admin/login', [LoginController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [LoginController::class, 'login']);
Route::post('/admin/logout', [LoginController::class, 'logout'])->name('admin.logout');