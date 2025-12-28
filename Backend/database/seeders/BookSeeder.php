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
            "cover_buku"=>"covers/Ayo_Mengenal_Huruf_Sambil_Mewarnai.jpg", // Simpan file di local kalian, buat folder baru nama: covers, storage/app/public/covers | Di terminal jalankan php artisan storage:link
            "kertas_cover"=>"Soft Cover AC 230 gr",
            "kertas_isi"=>"HVS 80 gr",
            "warna_cover"=>"Full Colour",
            "warna_isi"=>"Full Colour",
            "description"=>"Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            "harga"=>29000,
            "stok"=>10,
            "no_surat_puskurbuk"=>"1",
            "catatan"=>469,

        ]);

        Book::create([
            "segmentasi_id"=>1, // (1 Usia Dini, 2 Anak, 3 Pengayaan Guru)
            "judul"=>"Adab di Dalam Rumah",
            "kategori_id"=>3, // (1 Pembelajaran, 2 Fiksi Anak, 3 Agama, 4 Non Fiksi Anak, 5 Pengetahuan atau Sejarah, 6 Keterampilan, 7 Pendidikan)
            "isbn"=>"978-602-268-185-4",
            "author_id"=>3, // (1 Contessa & Meity, 2 Zaidan R, 3 Nurul Ihsan, 4 Yoli Hemdi, 5 Qorry Aini, 6 Tristan, 7 Musyaffa, 8 Rulli & Enak, 9 Abu dkk )
            "penerbit"=>"Luxima Metro Media",
            "tahun_terbit"=>2017,
            "ukuran"=>"19 x 23",
            "hal"=>62,
            "cover_buku"=>"covers/Adab_di_Dalam_Rumah.jpg",
            "kertas_cover"=>"Soft Cover AC 260 gr",
            "kertas_isi"=>"HVS 70 gr",
            "warna_cover"=>"Full Colour",
            "warna_isi"=>"Full Colour",
            "description"=>"Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            "harga"=>49000,
            "stok"=>10,
            "tgl_surat_keputusan"=>"2017-08-13",
            "no_surat_puskurbuk"=>"SK. B498/H3.3/PB/2017",
            "catatan"=>811,

        ]);
    }
}
