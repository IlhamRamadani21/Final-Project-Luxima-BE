<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Segmentation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SegmentationController extends Controller
{
<<<<<<< HEAD
     public function index()
    {
        // Meng GET semua data segmentasi dari database
        $segmentations = Segmentation::with('genres')->get();
=======
    public function index()
    {
        // Ambil data + hitung jumlah buku
        $segmentations = Segmentation::withCount('books')->latest()->get();
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06

        return response()->json([
            'jumlahData' => $segmentations->count(),
            'message' => 'Daftar segmentasi berhasil diambil',
            'data' => $segmentations
        ], 200);
    }

<<<<<<< HEAD
    // Menmbahkan segmentasi baru ke database.
=======
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
    public function store(Request $request)
    {
        try {
            // Validasi 'nama' wajib diisi
            $validatedData = $request->validate([
<<<<<<< HEAD
                'nama' => 'required|string|max:255',
=======
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi',
            ], [
                'segmentasi.required' => 'Nama segmentasi wajib diisi.',
                'segmentasi.unique' => 'Segmentasi ini sudah ada.',
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
            ]);

            // Membuat instance segmentasi baru dan menyimpannya
            $segmentations = Segmentation::create($validatedData);

            return response()->json([
                'message' => 'Segmentasi berhasil ditambahkan',
<<<<<<< HEAD
                'data' => $segmentations
            ], 201); // Kode status 201 ditambahlkan
=======
                'data' => $segmentation
            ], 201);
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }

<<<<<<< HEAD
    // Menampilkan detail satu segmentasi spesifik.

    public function show($id)
    {
        // Mencari segmentasi berdasarkan ID, kalo enggak ditemukan mengembalikan 404
        $segmentations = Segmentation::find($id);

        if (!$segmentations) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
=======
    public function show($id)
    {
        // Load relasi books untuk ditampilkan saat edit
        $segmentation = Segmentation::with('books')->find($id);

        if (!$segmentation) {
            return response()->json(['message' => 'Segmentasi tidak ditemukan'], 404);
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
        }

        return response()->json([
            'message' => 'Detail segmentasi berhasil diambil',
            'data' => $segmentations
        ], 200);
    }

<<<<<<< HEAD
    // Memperbarui data segmentasi.
=======
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
    public function update(Request $request, $id)
    {
        $segmentations = Segmentation::find($id);

<<<<<<< HEAD
        if (!$segmentations) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
        }

        try {
            // Validasi input untuk update
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255',
=======
        if (!$segmentation) {
            return response()->json(['message' => 'Segmentasi tidak ditemukan'], 404);
        }

        try {
            $validatedData = $request->validate([
                // Unique ignore ID saat ini
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi,'.$segmentation->id,
            ], [
                'segmentasi.required' => 'Nama segmentasi wajib diisi.',
                'segmentasi.unique' => 'Nama segmentasi sudah digunakan.',
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
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

<<<<<<< HEAD
    // Menghapus data segmentasi.
=======
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
    public function destroy($id)
    {
        $segmentations = Segmentation::find($id);

<<<<<<< HEAD
        if (!$segmentations) {
=======
        if (!$segmentation) {
            return response()->json(['message' => 'Segmentasi tidak ditemukan'], 404);
        }

        // --- CEK CONSTRAINT ---
        if ($segmentation->books()->count() > 0) {
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
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