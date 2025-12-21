<?php

namespace App\Http\Controllers;

use App\Models\Segmentation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SegmentationController extends Controller
{
    public function index()
    {
        // Ambil data + hitung jumlah buku
        $segmentations = Segmentation::withCount('books')->latest()->get();

        return response()->json([
            'message' => 'Daftar segmentasi berhasil diambil',
            'data' => $segmentations
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi',
            ], [
                'segmentasi.required' => 'Nama segmentasi wajib diisi.',
                'segmentasi.unique' => 'Segmentasi ini sudah ada.',
            ]);

            $segmentation = Segmentation::create($validatedData);

            return response()->json([
                'message' => 'Segmentasi berhasil ditambahkan',
                'data' => $segmentation
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
        // Load relasi books untuk ditampilkan saat edit
        $segmentation = Segmentation::with('books')->find($id);

        if (!$segmentation) {
            return response()->json(['message' => 'Segmentasi tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail segmentasi berhasil diambil',
            'data' => $segmentation
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $segmentation = Segmentation::find($id);

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
            ]);

            $segmentation->update($validatedData);

            return response()->json([
                'message' => 'Data segmentasi berhasil diperbarui',
                'data' => $segmentation
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
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json(['message' => 'Segmentasi tidak ditemukan'], 404);
        }

        // --- CEK CONSTRAINT ---
        if ($segmentation->books()->count() > 0) {
            return response()->json([
                'message' => 'Gagal menghapus: Segmentasi ini masih digunakan oleh buku yang terdaftar.'
            ], 409); // 409 Conflict
        }

        $segmentation->delete();

        return response()->json([
            'message' => 'Segmentasi berhasil dihapus'
        ], 200);
    }
}