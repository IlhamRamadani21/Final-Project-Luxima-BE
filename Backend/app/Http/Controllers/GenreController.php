<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GenreController extends Controller
{

    // Menampilkan daftar semua genre/kategori.
    // Mencoba memahami semua error yang muncul kek memahami kemauan dia

    public function index()
    {
        // Mengambil semua data genre dari database
        // Melihat semua output dengan pasrah. Semoga ada yang bener...
        $genres = Genre::all();

        return response()->json([
            'message' => 'Daftar kategori berhasil diambil (Akhirnya tampil jugak)',
            'data' => $genres
        ], 200);
    }

    // Menambahkan data genre baru.
    // Nambahin fitur baru, berharap nggak bikin eror yang aneh-aneh lagi.

    public function store(Request $request)
    {
        try {
            // Validasi input: 'kategori' dan 'deskripsi' wajib diisi
            $validatedData = $request->validate([
                'kategori' => 'required|string|max:100|unique:genres,kategori',
                'deskripsi' => 'nullable|string|max:255',
            ]);

            // Membuat instance genre baru dan menyimpannya
            // Kode running tanpa error! Alhamdulillah...
            $genre = Genre::create($validatedData);

            return response()->json([
                'message' => 'Kategori berhasil ditambahkan (Selamat! Fitur baru berjalan mulus!)',
                'data' => $genre
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal (Yah, kena error lagi...)',
                'errors' => $e->errors()
            ], 422);
        }
    }


    public function show($id)
    {
        // Mencari genre berdasarkan ID, Kalo enggak ditemukan mengembalikan 404
        // Datanya kok nggak ada?! Jangan bilang harus ketik ulang yaa...
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan (Data hilang ditelan bumi)',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail kategori berhasil diambil (Akhirnya ketemu juga kamu!)',
            'data' => $genre
        ], 200);
    }

    // Memperbarui data genre/kategori.
    // Refactoring kode lama, berharap bisa balikan lagi uda terlalu lama soalnya.

    public function update(Request $request, $id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan (Data udah nggak bisa diselamatkan)',
            ], 404);
        }

        try {
            // Validasi input untuk update
            // Coba perbaiki sikapnya di sini. Semoga berhasil...
            $validatedData = $request->validate([
                'kategori' => 'required|string|max:100|unique:genres,kategori,'.$genre->id,
                'deskripsi' => 'nullable|string|max:255',
            ]);

            // Memperbarui data yang sudah divalidasi
            // Done! Semoga kali ini bener semua.
            $genre->update($validatedData);

            return response()->json([
                'message' => 'Data kategori berhasil diperbarui (Tes lagi, tes lagi...)',
                'data' => $genre
            ], 200);

        } catch (ValidationException $e) {
             return response()->json([
                'message' => 'Validasi gagal (Ya ampun, *bug* baru muncul!)',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Menghapus genre dari database.
    // Ketika sadar fitur ini cuma bikin kode makin ribet. Saatnya dihapus.

    public function destroy($id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan (Nggak ada yang bisa dihapus)',
            ], 404);
        }

        $genre->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus (Lega! Kode jadi lebih bersih)',
        ], 200);
    }
}
