<?php
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\SegmentationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CartController;
use App\Models\Cart;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Route Public (Tidak butuh token)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Route Protected (Butuh Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Nanti pindahkan resource route ke sini

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::resource('books', BookController::class);
Route::resource('authors', AuthorController::class);
Route::resource('genres', GenreController::class);
Route::resource('segmentations', SegmentationController::class);
Route::resource('carts', CartController::class);
