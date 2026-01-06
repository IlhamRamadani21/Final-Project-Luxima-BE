<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Kode unik transaksi, misal: TRX-20250106-001
            $table->string('code')->unique(); 
            
            $table->integer('total_price');
            
            // Status lengkap sesuai alur bisnis
            $table->enum('status', [
                'pending_payment',      // Menunggu user upload bukti bayar
                'pending_verification', // User sudah upload, Admin perlu cek
                'processed',            // Pembayaran valid, sedang disiapkan
                'shipped',              // Barang dikirim (ada resi)
                'completed',            // Barang diterima / selesai
                'cancelled'             // Dibatalkan
            ])->default('pending_payment');

            // Bukti Pembayaran
            $table->string('payment_proof')->nullable();
            
            // Alamat Pengiriman
            $table->text('shipping_address');
            
            // Nomor Resi
            $table->string('tracking_number')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
