<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        // Gunakan Eager Loading 'book' agar data judul/harga buku muncul di React
        $carts = Cart::with('book')->where('user_id', Auth::id())->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $carts
        ]);
    }

    public function store(Request $request)
    {
        // Validasi Input
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        //Cek stok buku
        $book = Book::find($request->book_id);
        if ($book->stok < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok buku tidak mencukupi.'
            ], 400);
        }

        //kalo buku sudah ada di keranjang,maka jumlahnya aja yang ditambahin kadang user suka lupa
        $cart = Cart::where('user_id', Auth::id())
                    ->where('book_id', $request->book_id)
                    ->first();

        if ($cart) {
            $cart->update([
                'quantity' => $cart->quantity + $request->quantity
            ]);
        } else {
            // Jika belum ada, buat data baru
            $cart = Cart::create([
                'user_id' => Auth::id(),
                'book_id' => $request->book_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dimasukkan ke keranjang',
            'data' => $cart
        ]);
    }

    // Update jumlah buku yang keranajg
    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        // cek keranjang berdasarkan milik user yang login
        $cart = Cart::where('user_id', Auth::id())->find($id);

        if (!$cart) {
            return response()->json(['message' => 'Item tidak ditemukan'], 404);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json(['success' => true, 'message' => 'Jumlah berhasil diperbarui']);
    }

    //Hapus item dari keranjang
    public function destroy($id)
    {
        $cart = Cart::where('user_id', Auth::id())->find($id);

        if (!$cart) {
            return response()->json(['message' => 'Item tidak ditemukan'], 404);
        }

        $cart->delete();

        return response()->json(['success' => true, 'message' => 'Item dihapus dari keranjang']);
    }
}
