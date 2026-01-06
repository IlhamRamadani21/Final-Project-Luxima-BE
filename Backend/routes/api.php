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
| 1. ROUTE PUBLIC (GUEST) - Tidak perlu Login
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{author}', [AuthorController::class, 'show']);
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/genres/{genre}', [GenreController::class, 'show']);
Route::get('/segmentations', [SegmentationController::class, 'index']);
// Perbaikan: Ganti GenreController menjadi SegmentationController & benahi penulisan variable
Route::get('/segmentations/{segmentation}', [SegmentationController::class, 'show']);

/*
|--------------------------------------------------------------------------
| 2. ROUTE PROTECTED - Wajib Login
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    /* --- KHUSUS USER (PEMBELI) --- */
    Route::middleware('role:user')->group(function () {
        Route::apiResource('carts', CartController::class);
        Route::post('/checkout', [App\Http\Controllers\OrderController::class, 'checkout']);
        Route::get('/my-orders', [App\Http\Controllers\OrderController::class, 'myOrders']);
        Route::get('/orders/{id}', [App\Http\Controllers\OrderController::class, 'show']);
        Route::post('/orders/{id}/pay', [App\Http\Controllers\OrderController::class, 'uploadProof']);
    });

    /* --- KHUSUS ADMIN (Bisa Tambah, Edit, Hapus) --- */
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('books', BookController::class)->except(['index', 'show']);
        Route::apiResource('authors', AuthorController::class)->except(['index', 'show']);
        Route::apiResource('genres', GenreController::class)->except(['index', 'show']);
        Route::apiResource('segmentations', SegmentationController::class)->except(['index', 'show']);
        Route::get('/admin/orders', [App\Http\Controllers\OrderController::class, 'indexAdmin']);
        Route::get('/admin/orders/{id}', [App\Http\Controllers\OrderController::class, 'showAdmin']);
        Route::patch('/admin/orders/{id}', [App\Http\Controllers\OrderController::class, 'updateStatus']);
    });
});
