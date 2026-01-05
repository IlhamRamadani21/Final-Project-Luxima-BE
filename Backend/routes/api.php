<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\SegmentationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| 1. ROUTE PUBLIC (GUEST)
| Bisa diakses siapa saja tanpa login.
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Guest hanya bisa LIHAT daftar buku, penulis, dan genre
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);

Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{author}', [AuthorController::class, 'show']);


Route::get('/genres', [GenreController::class, 'index']);
Route::get('/genres/{genre}', [GenreController::class, 'show']);
Route::get('/segmentations', [SegmentationController::class, 'index']);
Route::get('/segmentations/{segemention}', [GenreController::class, 'show']);

/*
|--------------------------------------------------------------------------
| 2. ROUTE PROTECTED (USER & ADMIN)
| Harus login (Sanctum) untuk semua fungsi di bawah ini.
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Profil & Logout
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--- KHUSUS USER (PEMBELI) ---
    | Fitur yang hanya dimiliki pelanggan
    */
    Route::middleware('role:user')->group(function () {
        Route::apiResource('carts', CartController::class);
        // Contoh rute pelanggan lainnya di masa depan:
        // Route::post('/checkout', [OrderController::class, 'store']);
        // Route::get('/my-orders', [OrderController::class, 'index']);
    });

    /*
    |--- KHUSUS ADMIN ---
    | Menggunakan middleware tambahan 'admin' (Opsional jika Anda sudah buat middleware-nya)
    | Admin bisa melakukan CRUD (Create, Update, Delete)
    */
    Route::middleware('role:admin')->group(function () {

    // Admin mengelola Master Data
    Route::apiResource('books', BookController::class)->except(['index', 'show']);
    Route::apiResource('authors', AuthorController::class)->except(['index', 'show']);
    Route::apiResource('genres', GenreController::class)->except(['index', 'show']);
    Route::apiResource('segmentations', SegmentationController::class)->except(['index', 'show']);
});

});
