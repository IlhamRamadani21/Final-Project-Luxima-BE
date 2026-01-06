<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    /**
     * PROSES CHECKOUT (Cart -> Order)
     */
    public function checkout(Request $request)
    {
        // Validasi Input (Alamat wajib diisi)
        $request->validate([
            'shipping_address' => 'required|string|min:10',
        ]);

        $user = Auth::user();
        
        // Ambil data keranjang user
        $cartItems = Cart::with('book')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Keranjang belanja kosong.'], 400);
        }

        // Mulai Database Transaction (Agar data konsisten)
        DB::beginTransaction();

        try {
            // Hitung Total Harga
            $totalPrice = 0;
            foreach ($cartItems as $item) {
                // Cek Stok (catatan = stok)
                if ($item->book->catatan < $item->quantity) {
                    // Rollback jika stok kurang
                    DB::rollBack(); 
                    return response()->json([
                        'message' => "Stok buku '{$item->book->judul}' tidak mencukupi."
                    ], 400);
                }
                $totalPrice += $item->book->harga * $item->quantity;
            }

            // Buat Record Order Utama
            $order = Order::create([
                'user_id' => $user->id,
                'code' => 'TRX-' . time() . '-' . mt_rand(100, 999), // Contoh: TRX-174823-123
                'total_price' => $totalPrice,
                'status' => 'pending_payment',
                'shipping_address' => $request->shipping_address,
            ]);

            // Pindahkan Item Cart ke OrderDetails & Kurangi Stok
            foreach ($cartItems as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'book_id' => $item->book_id,
                    'quantity' => $item->quantity,
                    'price' => $item->book->harga, // Simpan harga saat beli
                ]);

                // Kurangi Stok Buku (catatan)
                $item->book->decrement('catatan', $item->quantity);
            }

            // Kosongkan Keranjang
            Cart::where('user_id', $user->id)->delete();

            // Simpan Perubahan ke Database
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Checkout berhasil! Silakan lakukan pembayaran.',
                'order_id' => $order->id,
                'order_code' => $order->code
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua perubahan jika error
            return response()->json([
                'message' => 'Terjadi kesalahan saat checkout.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * LIST PESANAN (History)
     */
    public function myOrders()
    {
        $orders = Order::where('user_id', Auth::id())
                    ->with('details.book') // Load detail buku
                    ->latest()
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * DETAIL PESANAN
     */
    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
                    ->with('details.book')
                    ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * UPLOAD BUKTI BAYAR
     */
    public function uploadProof(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $order = Order::where('user_id', Auth::id())->find($id);

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        if ($request->hasFile('payment_proof')) {
            // Hapus bukti lama jika ada (untuk re-upload)
            if ($order->payment_proof && Storage::disk('public')->exists($order->payment_proof)) {
                Storage::disk('public')->delete($order->payment_proof);
            }

            // Simpan gambar baru
            $path = $request->file('payment_proof')->store('payments', 'public');
            
            $order->update([
                'payment_proof' => $path,
                'status' => 'pending_verification' // Ubah status agar admin cek
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bukti pembayaran berhasil diupload. Tunggu verifikasi admin.',
                'data' => $order
            ]);
        }

        return response()->json(['message' => 'Gagal upload file'], 400);
    }

    /**
     * [ADMIN] Lihat Semua Pesanan
     */
    public function indexAdmin(Request $request)
    {
        $query = Order::with(['user', 'details.book'])->latest();

        // Fitur Search (Kode Order atau Nama User)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter Status (Optional, jika nanti butuh filter tab)
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $orders = $query->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * [ADMIN] Lihat Detail Pesanan (Bisa punya siapa saja)
     */
    public function showAdmin($id)
    {
        // Load relasi user (untuk info pemesan) dan details.book (untuk item)
        $order = Order::with(['user', 'details.book'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * [ADMIN] Update Status & Resi
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        $request->validate([
            'status' => 'required|in:pending_payment,pending_verification,processed,shipped,completed,cancelled',
            'tracking_number' => 'nullable|string'
        ]);

        // Update data
        $order->status = $request->status;

        // Jika status diubah jadi 'shipped' (dikirim), simpan nomor resi
        if ($request->status == 'shipped' && $request->tracking_number) {
            $order->tracking_number = $request->tracking_number;
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui',
            'data' => $order
        ]);
    }
}