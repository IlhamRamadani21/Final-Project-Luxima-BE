<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Author;
use App\Models\Genre;
use App\Models\Segmentation;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class BookController extends Controller
{


    public function index(Request $request)
    {
        // Mengambil semua buku, sekaligus memuat relasi (segmentasi, kategori, author)
        $books = Book::with(['segmentasi', 'kategori', 'author'])->get();

        $query = Book::with('author'); 

        // Cek apakah ada parameter 'search' dari frontend
        if ($request->has('search') && $request->search != '') {
            $keyword = $request->search;

            $query->where(function ($q) use ($keyword) {
                // Cari berdasarkan Judul
                $q->where('judul', 'like', '%' . $keyword . '%')
                  // Cari berdasarkan ISBN
                  ->orWhere('isbn', 'like', '%' . $keyword . '%')
                  // Cari berdasarkan Nama Penulis
                  ->orWhereHas('author', function ($authorQuery) use ($keyword) {
                      $authorQuery->where('nama', 'like', '%' . $keyword . '%');
                  });
            });
        }

        $books = $query->get();

        return response()->json([
            'message' => 'Daftar buku berhasil diambil',
            'data' => $books
        ], 200);
    }


    // Menambah buku baru ke etalase

    public function store(Request $request)
    {
        try {
            // Validasi data yang di input
            $validatedData = $request->validate([
                'segmentasi_id' => 'required|exists:segmentations,id',
                'judul' => 'required|string|max:255',
                'kategori_id' => 'required|exists:genres,id',
                'isbn' => 'required|string|unique:books,isbn|max:20',
                'author_id' => 'required|exists:authors,id',
                'penerbit' => 'required|string|max:100',
                'tahun_terbit' => 'required|integer|min:1900|max:' . date('Y'),
                'ukuran' => 'nullable|string|max:50',
                'hal' => 'nullable|integer',
                'cover_buku' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'kertas_cover' => 'nullable|string|max:50',
                'kertas_isi' => 'nullable|string|max:50',
                'warna_cover' => 'nullable|string|max:50',
                'warna_isi' => 'nullable|string|max:50',
                'harga' => 'required|numeric|min:0',
                'tgl_surat_keputusan' => 'nullable|date',
                'no_surat_puskurbuk' => 'nullable|string|max:100',
                'catatan' => 'nullable|string',
            ]);

             if ($request->hasFile('cover_buku')) {
                // Simpan gambar ke storage/app/public/photos
                $path = $request->file('cover_buku')->store('photos', 'public');
                $validatedData['cover_buku'] = $path;
            }

            $book = Book::create($validatedData);

            return response()->json([
                'message' => 'Buku berhasil ditambahkan (Status: Taken!)',
                'data' => $book
            ], 201); // Kode status 201 Created

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal (Ditolak mentah-mentah!)',
                'data' => $e->errors()
            ], 422);
        }
    }


    // Menampilkan detail satu buku spesifik

    public function show($id)
    {
        // Mencari buku berdasarkan ID, jika tidak ditemukan akan mengembalikan 404
        $book = Book::with(['segmentasi', 'kategori', 'author'])->find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Detail buku berhasil diambil: {$id}",
            'data' => $book
        ], 200);
    }


    // Memperbarui data buku

    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
                'data' => null
            ], 404);
        }

        try {
            $validatedData = $request->validate([
                'segmentasi_id' => 'required|exists:segmentations,id',
                'judul' => 'required|string|max:255',
                'kategori_id' => 'required|exists:genres,id',
                'isbn' => 'required|string|max:20|unique:books,isbn,'.$book->id,
                'author_id' => 'required|exists:authors,id',
                'penerbit' => 'required|string|max:100',
                'tahun_terbit' => 'required|integer|min:1900|max:' . date('Y'),
                'cover_buku' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'harga' => 'required|numeric|min:0',
            ]);

             if ($request->hasFile('cover_buku')) {
                // 1. Hapus gambar lama semisal ada dari storage
                if ($book->cover_buku && Storage::disk('public')->exists($book->cover_buku)) {
                    Storage::disk('public')->delete($book->cover_buku);
                }

                // 2. Upload gambar baru dan simpan path-nya
                $path = $request->file('cover_buku')->store('photos', 'public');
                $validatedData['cover_buku'] = $path;
            }

            // Data berhasil di-update
            $book->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Data buku berhasil diperbarui',
                'data' => $book
            ], 200);

        } catch (ValidationException $e) {
             return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Menghapus buku dari etalase

    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
                'data' => null
            ], 404);
        }

        if ($book->cover_buku && Storage::disk('public')->exists($book->cover_buku)) {
            Storage::disk('public')->delete($book->cover_buku);
        }

        $book->delete();

        return response()->json([
             'success' => true,
            'message' => 'Buku berhasil dihapus',
            'data' => null
        ], 200);
    }
}
