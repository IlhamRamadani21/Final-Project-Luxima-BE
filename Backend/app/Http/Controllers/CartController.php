<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
//    public function store(Request $request)
//     {
//         $request->validate([
//             'book_id' => 'required|exists:books,id',
//             'quantity' => 'required|integer|min:1'
//         ]);

//         // Cari apakah buku sudah ada di keranjang user ini
//         $cart = Cart::where('user_id', Auth::id())
//                     ->where('book_id', $request->book_id)
//                     ->first();

//         if ($cart) {
//             $cart->increment('quantity', $request->quantity);
//             return response()->json(['message' => 'Jumlah buku ditambah']);
//         }

//         Cart::create([
//             'user_id' => Auth::id(),
//             'book_id' => $request->book_id,
//             'quantity' => $request->quantity
//         ]);

//         return response()->json(['message' => 'Berhasil masuk keranjang']);
//     }

//     // Lihat isi keranjang
//     public function index()
//     {
//         $items = Cart::with('book')->where('user_id', Auth::id())->get();
//         return response()->json($items);
//     }
}
