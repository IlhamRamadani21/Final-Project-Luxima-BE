<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\SegmentationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Route::apiResource('/book', [BookController::class, 'index']);

Route::resource('books', BookController::class);
Route::resource('authors', AuthorController::class);
Route::resource('genres', GenreController::class);
Route::resource('segmentations', SegmentationController::class);
