<?php

namespace Database\Seeders;
use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::create([
            "segmentasi_id"=>1,
            "judul"=>"Ayo Mengenal Huruf Sambil Mewarnai",
            "kategori_id"=>1,
            "isbn"=>"978-602-7635-42-5",
            "author_id"=>1,
            "penerbit"=>"Luxima Metro Media",
            "tahun_terbit"=>2012,
            "ukuran"=>"19 x 26",
            "hal"=>52,
            "cover_buku"=>"Ayo_Mengenal_Huruf_Sambil_Mewarani.jpg",
            "kertas_cover"=>"Soft Cover AC 230 gr",
            "kertas_isi"=>"HVS 80 gr",
            "warna_cover"=>"Full Colour",
            "warna_isi"=>"Full Colour",
            "harga"=>29000,
            "no_surat_puskurbuk"=>"1",
            "catatan"=>469,

        ]);
    }
}
