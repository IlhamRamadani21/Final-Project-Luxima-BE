<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GenreController extends Controller
{
    public function index()
    {
        // Ambil data + hitung jumlah buku
        $genres = Genre::withCount('books')->latest()->get();

        return response()->json([
            'message' => 'Daftar kategori berhasil diambil',
            'data' => $genres
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'kategori' => 'required|string|max:100|unique:genres,kategori',
                'deskripsi' => 'nullable|string|max:255',
            ], [
                'kategori.required' => 'Nama kategori wajib diisi.',
                'kategori.unique' => 'Kategori ini sudah ada.',
            ]);

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
        // Load relasi books agar bisa tampil di halaman edit
        $genre = Genre::with('books')->find($id);

        if (!$genre) {
            return response()->json(['message' => 'Kategori tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail kategori berhasil diambil',
            'data' => $genre
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json(['message' => 'Kategori tidak ditemukan'], 404);
        }

        try {
            $validatedData = $request->validate([
                // Unique ignore ID saat ini
                'kategori' => 'required|string|max:100|unique:genres,kategori,'.$genre->id,
                'deskripsi' => 'nullable|string|max:255',
            ], [
                'kategori.required' => 'Nama kategori wajib diisi.',
                'kategori.unique' => 'Nama kategori sudah digunakan.',
            ]);

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

    public function destroy($id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json(['message' => 'Kategori tidak ditemukan'], 404);
        }

        // --- CEK CONSTRAINT ---
        if ($genre->books()->count() > 0) {
            return response()->json([
                'message' => 'Gagal menghapus: Kategori ini masih digunakan oleh buku yang terdaftar.'
            ], 409); // 409 Conflict
        }

        $genre->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus'
        ], 200);
    }
}