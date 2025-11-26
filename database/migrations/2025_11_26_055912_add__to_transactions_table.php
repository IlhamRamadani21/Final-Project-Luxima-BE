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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('nomor_pesanan', 255)->unique()->after('id');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict')->after('nomor_pesanan');
            $table->foreignId('buku_id')->constrained('books')->onDelete('restrict')->after('user_id');
            $table->unsignedInteger('total_harga')->after('buku_id');
            $table->enum('status', [
                'menunggu pembayaran',
                'menunggu verifikasi',
                'diproses',
                'dikirim',
                'selesai',
                'dibatalkan'
            ])->default('menunggu pembayaran')->after('total_harga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
