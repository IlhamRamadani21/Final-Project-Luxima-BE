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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('segmentasi_id')->constrained('segmentations')->onDelete('restrict');
            $table->string('judul', 255);
            $table->foreignId('kategori_id')->constrained('genres')->onDelete('restrict');
            $table->string('isbn', 50)->unique()->nullable();
            $table->foreignId('author_id')->constrained('authors')->onDelete('restrict');
            $table->string('penerbit', 255);
            $table->integer('tahun_terbit');
            $table->string('ukuran', 50)->nullable();
            $table->integer('hal')->nullable();
            $table->string('cover_buku', 255)->nullable();
            $table->string('kertas_cover', 100)->nullable();
            $table->string('kertas_isi', 100)->nullable();
            $table->string('warna_cover', 50)->nullable();
            $table->string('warna_isi', 50)->nullable();
            $table->integer('harga')->unsigned();
            $table->integer('stok')->unsigned();
            $table->date('tgl_surat_keputusan')->nullable();
            $table->string('no_surat_puskurbuk', 255)->nullable();
            $table->integer('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
