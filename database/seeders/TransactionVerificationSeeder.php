<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionVerificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = DB::table('users')->where('email', 'pelanggan@test.com')->value('id');
        $bookId = DB::table('books')->value('id');
        
        // Jika data tidak ditemukan
        if (!$userId || !$bookId) {
            $this->command->warn('Skip seeder karena data pelanggan atau buku tidak ditemukan. Jalankan seeder dulu');
            return;
        }

        // Membuat transaksi baru dengan status menunggu verifikasi
        $transactionId = DB::table('transactions')->insertGetId([
            'nomor_pesanan' => 'LX-20251126-A', // TESTING
            'user_id' => $userId,
            'buku_id' => $bookId,
            'total_harga' => 66000,
            'status' => 'menunggu verifikasi', // STATUS UNTUK TESTING
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Membuat detail transaksi
        
        // Pastikan sudah menyiapkan file gambar dummy di 
        // storage/app/public/bukti_transfer/test_bukti.jpg
        DB::table('payment_verifications')->insert([
            'transaction_id' => $transactionId,
            'bukti_pembayaran' => 'bukti_transfer/test_bukti.jpg', 
            'tanggal_transfer' => now()->subHours(2),
            'payment_method' => 'Transfer Dana',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $this->command->info('Transaction seeder berhasil dijalankan dengan nomor pesanan (LX-20251126-A).');
    }
}
