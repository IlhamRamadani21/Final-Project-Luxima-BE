<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class PaymentVerificationController extends Controller
{
    /**
     * Menampilkan daftar transaksi yang menunggu verifikasi (F-12 Index).
     */
    public function index()
    {
        // Ambil semua transaksi dengan status 'menunggu verifikasi'
        $transactions = Transaction::where('status', 'menunggu verifikasi')
            ->with(['user', 'verification']) // Eager Load user dan bukti verifikasi
            ->latest()
            ->get();

        // Tampilkan view
        return view('admin.verifications.index', compact('transactions'));
    }

    /**
     * Menampilkan detail transaksi dan bukti pembayaran untuk diverifikasi (F-12 Detail).
     */
    public function show(Transaction $transaction)
    {
        // Cek status transaksi
        if ($transaction->status !== 'menunggu verifikasi') {
            return redirect()->route('admin.verifications.index')->with('error', 'Transaksi ini sudah diverifikasi.');
        }

        // Load relasi yang diperlukan untuk ditampilkan
        $transaction->load(['user', 'verification']);

        // Tampilkan view detail
        return view('admin.verifications.show', compact('transaction'));
    }

    /**
     * Logika untuk menyetujui atau menolak pembayaran (F-12 Verifikasi Action).
     */
    public function verify(Request $request, Transaction $transaction)
    {
        // Validasi input
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        if ($request->input('action') === 'approve') {
            // Jika disetujui: ubah status menjadi 'diproses' (F-13)
            $transaction->status = 'diproses'; 
            $message = 'Pembayaran disetujui. Status pesanan diubah menjadi Diproses.';
        } else {
            // Jika ditolak: ubah status kembali menjadi 'menunggu pembayaran'
            $transaction->status = 'menunggu pembayaran'; 
            // Alasan penolakan untuk dikirim ke pelanggan (bisa disesuaikan lagi)
            $message = 'Pembayaran ditolak. Status pesanan dikembalikan untuk menunggu pembayaran ulang.';
        }

        $transaction->save();

        // Kembali ke daftar verifikasi
        return redirect()->route('admin.verifications.index')->with('success', $message);
    }
}