<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthorController extends Controller
{
    // Menampilkan daftar semua penulis.
    public function index()
    {
        // Meng GET semua data penulis dari database
        $authors = Author::all();

        return response()->json([
            'jumlahData' => $authors->count(),
            'message' => 'Daftar penulis berhasil diambil',
            'data' => $authors
        ], 200);
    }

    // Menmbahkan penulis baru ke database.
    public function store(Request $request)
    {
        try {
            // Validasi 'nama' wajib diisi
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255',
            ]);

            // Membuat instance penulis baru dan menyimpannya
            $author = Author::create($validatedData);

            return response()->json([
                'message' => 'Penulis berhasil ditambahkan',
                'data' => $author
            ], 201); // Kode status 201 ditambahlkan

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Menampilkan detail satu penulis spesifik.

    public function show($id)
    {
        // Mencari penulis berdasarkan ID, kalo enggak ditemukan mengembalikan 404
        $author = Author::find($id);

        if (!$author) {
            return response()->json([
                'message' => 'Penulis tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail penulis berhasil diambil',
            'data' => $author
        ], 200);
    }

    // Memperbarui data penulis.
    public function update(Request $request, $id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json([
                'message' => 'Penulis tidak ditemukan'
            ], 404);
        }

        try {
            // Validasi input untuk update
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255',
            ]);

            // Memperbarui data yang udah di cek
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

    // Menghapus data penulis.
    public function destroy($id)
    {
        $author = Author::find($id);

        if (!$author) {
            return response()->json([
                'message' => 'Penulis tidak ditemukan'
            ], 404);
        }

        $author->delete();

        return response()->json([
            'message' => 'Penulis berhasil dihapus'
        ], 200);
    }
}
