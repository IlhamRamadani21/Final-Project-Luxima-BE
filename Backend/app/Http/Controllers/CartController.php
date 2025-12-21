<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // public function index()
    // {
    //     $items = Cart::with('book')->where('user_id', Auth::id())->get();
    //     return response()->json($items);
    // }

    public function index()
{
    // KARENA TANPA MIDDLEWARE:
    // Kita ambil user pertama yang ada di database sebagai "simulasi" login
    $user = \App\Models\User::first();

    if (!$user) {
        return response()->json(['message' => 'Tidak ada data user di database. Jalankan Seeder dulu!'], 404);
    }

    // Ambil data berdasarkan ID user pertama tadi
    $items = Cart::with('book')
                 ->where('user_id', $user->id)
                 ->get();

    return response()->json([
        'info' => 'Menampilkan data untuk User ID: ' . $user->id,
        'data' => $items
    ]);
}


   public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Cari apakah buku sudah ada di keranjang user ini
        $cart = Cart::where('user_id', Auth::id())
                    ->where('book_id', $request->book_id)
                    ->first();

        if ($cart) {
            $cart->increment('quantity', $request->quantity);
            return response()->json(['message' => 'Jumlah buku ditambah']);
        }

        Cart::create([
            'user_id' => Auth::id(),
            'book_id' => $request->book_id,
            'quantity' => $request->quantity
        ]);

        return response()->json(['message' => 'Berhasil masuk keranjang']);
    }
}
