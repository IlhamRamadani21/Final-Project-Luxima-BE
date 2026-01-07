<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
// Tambahkan Import ini untuk menangkap error database
use Illuminate\Database\QueryException; 

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with(['segmentasi', 'kategori', 'author']);

        if ($request->has('search') && $request->search != '') {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('judul', 'like', '%'.$keyword.'%')
                    ->orWhere('isbn', 'like', '%'.$keyword.'%')
                    ->orWhereHas('author', function ($authorQuery) use ($keyword) {
                        $authorQuery->where('nama', 'like', '%'.$keyword.'%');
                    });
            });
        }

        if ($request->has('is_best_seller') && $request->is_best_seller == '1') {
            $query->where('is_best_seller', true);
        }

        $books = $query->latest()->get();

        return response()->json([
            'jumlahData' => $books->count(),
            'message' => 'Daftar buku berhasil diambil',
            'data' => $books
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $rules = [
                'segmentasi_id' => 'required|exists:segmentations,id',
                'judul' => 'required|string|max:255',
                'kategori_id' => 'required|exists:genres,id',
                'isbn' => 'required|string|unique:books,isbn|max:20',
                'author_id' => 'required|exists:authors,id',
                'penerbit' => 'required|string|max:100',
                'tahun_terbit' => 'required|integer|min:1900|max:'.date('Y'),
                'ukuran' => 'nullable|string|max:50',
                'hal' => 'nullable|integer',
                'cover_buku' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'kertas_cover' => 'nullable|string|max:50',
                'kertas_isi' => 'nullable|string|max:50',
                'warna_cover' => 'nullable|string|max:50',
                'warna_isi' => 'nullable|string|max:50',
                'description' => 'nullable|string',
                'harga' => 'required|numeric|min:0',
                'is_best_seller' => 'boolean',
                'tgl_surat_keputusan' => 'nullable|date',
                'no_surat_puskurbuk' => 'nullable|string|max:100',
                'catatan' => 'nullable|integer', 
            ];

            $messages = [
                'tahun_terbit.min' => 'Tahun terbit tidak valid (minimal tahun 1900).',
                'harga.min' => 'Harga tidak boleh negatif.',
                'cover_buku.max' => 'Ukuran gambar terlalu besar! Maksimal 2MB.',
                'isbn.unique' => 'Nomor ISBN ini sudah terdaftar.',
                'required' => 'Kolom :attribute wajib diisi.',
            ];

            $validatedData = $request->validate($rules, $messages);

            $validatedData['stok'] = isset($validatedData['catatan']) ? (int)$validatedData['catatan'] : 0;

            if ($request->hasFile('cover_buku')) {
                $path = $request->file('cover_buku')->store('covers', 'public');
                $validatedData['cover_buku'] = $path;
            }

            $book = Book::create($validatedData);

            return response()->json([
                'message' => 'Buku berhasil ditambahkan',
                'data' => $book
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
        $book = Book::with(['segmentasi', 'kategori', 'author'])->find($id);

        if (! $book) {
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

    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        try {
            $rules = [
                'segmentasi_id' => 'required|exists:segmentations,id',
                'judul' => 'required|string|max:255',
                'kategori_id' => 'required|exists:genres,id',
                'isbn' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique('books', 'isbn')->ignore($book->id),
                ],
                'author_id' => 'required|exists:authors,id',
                'penerbit' => 'required|string|max:100',
                'tahun_terbit' => 'required|integer|min:1900|max:'.date('Y'),
                'ukuran' => 'nullable|string|max:50',
                'hal' => 'nullable|integer',
                'cover_buku' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'harga' => 'required|numeric|min:0',
                'is_best_seller' => 'boolean',
                'catatan' => 'nullable|integer',
                'kertas_cover' => 'nullable', 'kertas_isi' => 'nullable',
                'warna_cover' => 'nullable', 'warna_isi' => 'nullable',
                'tgl_surat_keputusan' => 'nullable', 'no_surat_puskurbuk' => 'nullable',
                'description' => 'nullable'
            ];

            $messages = [
                'isbn.unique' => 'ISBN sudah digunakan buku lain.',
            ];

            $validatedData = $request->validate($rules, $messages);

            if (isset($validatedData['catatan'])) {
                $validatedData['stok'] = (int)$validatedData['catatan'];
            }

            if ($request->hasFile('cover_buku')) {
                if ($book->cover_buku && Storage::disk('public')->exists($book->cover_buku)) {
                    Storage::disk('public')->delete($book->cover_buku);
                }
                $path = $request->file('cover_buku')->store('covers', 'public');
                $validatedData['cover_buku'] = $path;
            }

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

    // --- PERBAIKAN UTAMA DI SINI ---
    public function destroy($id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan',
                'data' => null
            ], 404);
        }

        try {
            // Coba hapus gambar dulu
            if ($book->cover_buku && Storage::disk('public')->exists($book->cover_buku)) {
                Storage::disk('public')->delete($book->cover_buku);
            }

            // Coba hapus data
            $book->delete();

            return response()->json([
                'success' => true,
                'message' => 'Buku berhasil dihapus',
                'data' => null
            ], 200);

        } catch (QueryException $e) {
            // Tangkap Error Constraint Violation (Foreign Key)
            // Error Code 23000 biasanya berarti data sedang dipakai di tabel lain (order_details)
            if ($e->getCode() == "23000") {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghapus: Buku ini sudah ada di riwayat transaksi pembeli. Data tidak boleh dihapus demi arsip transaksi.',
                ], 409); // 409 Conflict
            }

            // Error database lain yang tidak terduga
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server saat menghapus data.',
            ], 500);
        }
    }
}