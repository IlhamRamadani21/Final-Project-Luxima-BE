<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthorController extends Controller
{
    public function index()
    {
        // Ambil data penulis + jumlah bukunya
        $authors = Author::withCount('books')->latest()->get();

        return response()->json([
            'message' => 'Daftar penulis berhasil diambil',
            'data' => $authors
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255|unique:authors,nama',
            ], [
                'nama.required' => 'Nama penulis wajib diisi.',
                'nama.unique' => 'Nama penulis ini sudah ada di database.',
            ]);

            $author = Author::create($validatedData);

            return response()->json([
                'message' => 'Penulis berhasil ditambahkan',
                'data' => $author
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'data' => $e->errors()
            ], 422);
        }
    }

    public function show($id)
    {
        // Load relasi books agar bisa ditampilkan di halaman edit
        $author = Author::with('books')->find($id);

        if (!$author) {
            return response()->json(['message' => 'Penulis tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail penulis berhasil diambil',
            'data' => $author
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json(['message' => 'Penulis tidak ditemukan'], 404);
        }

        try {
            $validatedData = $request->validate([
                // Unique ignore ID saat ini
                'nama' => 'required|string|max:255|unique:authors,nama,'.$author->id,
            ], [
                'nama.unique' => 'Nama penulis ini sudah digunakan.',
            ]);

            $author->update($validatedData);

            return response()->json([
                'message' => 'Data penulis berhasil diperbarui',
                'data' => $author
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
        $author = Author::find($id);

        if (!$author) {
            return response()->json(['message' => 'Penulis tidak ditemukan'], 404);
        }

        // Cek apakah penulis memiliki buku
        // Jika penulis memiliki buku, tolak penghapusan.
        if ($author->books()->count() > 0) {
            return response()->json([
                'message' => 'Gagal menghapus: Penulis ini masih memiliki buku yang terdaftar. Hapus bukunya terlebih dahulu.'
            ], 409); // 409 Conflict
        }

        $author->delete();

        return response()->json([
            'message' => 'Penulis berhasil dihapus'
        ], 200);
    }
}