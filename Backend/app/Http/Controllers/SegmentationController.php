<?php

namespace App\Http\Controllers;

use App\Models\Segmentation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SegmentationController extends Controller
{
    /**
     * Tampilkan semua segmen yang ada.
     * Ini kayak nampilin koleksi kartu pokemon. Harus lengkap!
     */
    public function index()
    {
        // Ambil semua data segmen, jangan ada yang ketinggalan!
        $segmentations = Segmentation::all();

        return response()->json([
            'message' => 'Daftar segmentasi berhasil diambil (lengkap kap!)',
            'data' => $segmentations
        ], 200);
    }

    /**
     * Menyimpan (CREATE) segmen baru ke database.
     * Hati-hati salah input, nanti databasenya ngambek.
     */
    public function store(Request $request)
    {
        try {
            // Validasi dulu bro/sis, jangan main masukin data mentah aja kek dia😊
            $validatedData = $request->validate([
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi',
            ]);

            // Bikin segmen baru, mirip kayak bikin resep kue baru🎂
            $segmentation = Segmentation::create($validatedData);

            return response()->json([
                'message' => 'Segmentasi berhasil ditambahkan (horee!🎉)',
                'data' => $segmentation
            ], 201); // Kode status 201 Created (Sukses Besar!)

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal (yah, error nih!)',
                'errors' => $e->errors()
            ], 422); // Kode status 422 Unprocessable Entity (Datanya aneh!😒)
        }
    }


    // Mencari data yang dirasa cocok dan sefrekuensi.
    // semoga cepet ketemu yak
    public function show($id)
    {
        // Cari segmennya. Kalau gak ketemu, yaudah, bilang gak ada. hidup ini di enakin aja wkwk
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan (zonk!)'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail segmentasi berhasil diambil (dapat informasinya!)',
            'data' => $segmentation
        ], 200);
    }


    // Memperbaruidata segmen.
    // udah kek dia aja suka memperbarui pasangannya

    public function update(Request $request, $id)
    {
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan (lagi-lagi zonk!)'
            ], 404);
        }

        try {
            // Pastikan Lagi apa dia beneran serius?

            $validatedData = $request->validate([
                'segmentasi' => 'required|string|max:100|unique:segmentations,segmentasi,'.$segmentation->id,
            ]);

            // Update datanya, semoga lancar jaya!
            $segmentation->update($validatedData);

            return response()->json([
                'message' => 'Data segmentasi berhasil diperbarui (mulus kayak jalan tol!)',
                'data' => $segmentation
            ], 200);

        } catch (ValidationException $e) {
             return response()->json([
                'message' => 'Validasi gagal (error lagi, deh!)',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Menghapus Masa Lalu.
     * Bye-bye data, selamat jalan!😎
     */
    public function destroy($id)
    {
        $segmentation = Segmentation::find($id);

        if (!$segmentation) {
            return response()->json([
                'message' => 'Segmentasi tidak ditemukan (hilang ditelan bumi!)'
            ], 404);
        }

        $segmentation->delete();

        return response()->json([
            'message' => 'Segmentasi berhasil dihapus (berhasil move on! heheh)'
        ], 200);
    }
}
