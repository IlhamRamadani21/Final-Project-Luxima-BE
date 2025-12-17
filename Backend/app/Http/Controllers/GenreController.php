<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GenreController extends Controller
{

    // Menampilkan daftar semua genre/kategori.

    public function index()
    {
        // Mengambil semua data genre dari database
        $genres = Genre::all();

        return response()->json([
            'message' => 'Daftar kategori berhasil diambil',
            'data' => $genres
        ], 200);
    }

    // Menambahkan data genre baru.

    public function store(Request $request)
    {
        try {
            // Validasi input: 'kategori' dan 'deskripsi' wajib diisi
            $validatedData = $request->validate([
                'kategori' => 'required|string|max:100|unique:genres,kategori',
                'deskripsi' => 'nullable|string|max:255',
            ]);

            // Membuat instance genre baru dan menyimpannya
            $genre = Genre::create($validatedData);

            return response()->json([
                'message' => 'Kategori berhasil ditambahkan',
                'data' => $genre
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }


    public function show($id)
    {
        // Mencari genre berdasarkan ID, Kalo enggak ditemukan mengembalikan 404
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail kategori berhasil diambil',
            'data' => $genre
        ], 200);
    }

    // Memperbarui data genre/kategori.

    public function update(Request $request, $id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        try {
            // Validasi input untuk update
            $validatedData = $request->validate([
                'kategori' => 'required|string|max:100|unique:genres,kategori,'.$genre->id,
                'deskripsi' => 'nullable|string|max:255',
            ]);

            // Memperbarui data yang sudah divalidasi
            $genre->update($validatedData);

            return response()->json([
                'message' => 'Data kategori berhasil diperbarui',
                'data' => $genre
            ], 200);

        } catch (ValidationException $e) {
             return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Menghapus genre dari database.

    public function destroy($id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        $genre->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ], 200);
    }
}
