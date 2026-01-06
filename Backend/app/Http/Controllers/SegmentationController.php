<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Segmentation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SegmentationController extends Controller
{
     public function index()
    {
        // Meng GET semua data segmentasi dari database
        $segmentations = Segmentation::with('genres')
        ->withCount('books')
        ->latest()
        ->get();

        return response()->json([
            'jumlahData' => $segmentations->count(),
            'message' => 'Daftar segmentasi berhasil diambil',
            'data' => $segmentations
        ], 200);
    }

    // Menmbahkan segmentasi baru ke database.
    public function store(Request $request)
    {
        try {
            // Validasi 'nama' wajib diisi
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255',
            ]);

            // Membuat instance segmentasi baru dan menyimpannya
            $segmentations = Segmentation::create($validatedData);

            return response()->json([
                'message' => 'Segmentasi berhasil ditambahkan',
                'data' => $segmentations
            ], 201); // Kode status 201 ditambahlkan

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Menampilkan detail satu segmentasi spesifik.

    public function show($id)
    {
        // Mencari segmentasi berdasarkan ID, kalo enggak ditemukan mengembalikan 404
        $segmentations = Segmentation::find($id);

        if (!$segmentations) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail segmentasi berhasil diambil',
            'data' => $segmentations
        ], 200);
    }

    // Memperbarui data segmentasi.
    public function update(Request $request, $id)
    {
        $segmentations = Segmentation::find($id);

        if (!$segmentations) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
        }

        try {
            // Validasi input untuk update
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255',
            ]);

            // Memperbarui data yang udah di cek
            $segmentations->update($validatedData);

            return response()->json([
                'message' => 'Data segmentasi berhasil diperbarui',
                'data' => $segmentations
            ], 200);

        } catch (ValidationException $e) {
             return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Menghapus data segmentasi.
    public function destroy($id)
    {
        $segmentations = Segmentation::find($id);

        if (!$segmentations) {
            return response()->json([
                'message' => 'Gagal menghapus: Segmentasi ini masih digunakan oleh buku yang terdaftar.'
            ], 409); // 409 Conflict
        }

        $segmentations->delete();

        return response()->json([
            'message' => 'Segmentasi berhasil dihapus'
        ], 200);
    }
}
