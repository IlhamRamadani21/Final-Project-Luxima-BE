<?php

namespace App\Http\Controllers;

use App\Models\Segmentation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SegmentationController extends Controller
{
    /**
     * Tampilkan semua segmen yang ada.
     */
    public function index()
    {
        // Ambil semua data segmen
        $segmentations = Segmentation::all();

        return response()->json([
            'message' => 'Daftar segmentasi berhasil diambil',
            'data' => $segmentations
        ], 200);
    }

    /**
     * Menyimpan (CREATE) segmen baru ke database.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi',
            ]);

            $segmentation = Segmentation::create($validatedData);

            return response()->json([
                'message' => 'Segmentasi berhasil ditambahkan',
                'data' => $segmentation
            ], 201); // Kode status 201 Created

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422); // Kode status 422 Unprocessable Entity
        }
    }


    // Mencari data
    public function show($id)
    {
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail segmentasi berhasil diambil',
            'data' => $segmentation
        ], 200);
    }


    // Memperbaruidata segmen.

    public function update(Request $request, $id)
    {
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
        }

        try {

            $validatedData = $request->validate([
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi,'.$segmentation->id,
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

    /**
     * Menghapus Masa Lalu.
     */
    public function destroy($id)
    {
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan'
            ], 404);
        }

        $segmentation->delete();

        return response()->json([
            'message' => 'Segmentasi berhasil dihapus'
        ], 200);
    }
}
