<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BooksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('books')->insert([
            'segmentasi_id' => 1,
            'judul' => 'Seri Komik Adab Anak Muslim (Seri KAAMus) - Adab di Dalam Rumah',
            'kategori_id' => 1,
            'isbn' => '978-602-268-184-7',
            'author_id' => 1,
            'penerbit' => 'Luxima Metro Media',
            'tahun_terbit' => 2017,
            'ukuran' => '19 x 23',
            'hal' => 62,
            'cover_buku' => null,
            'kertas_cover' => 'SoftCover AC 260 gr',
            'kertas_isi' => 'HVS 70 Gr',
            'warna_cover' => 'Full Colour',
            'warna_isi' => 'Full Colour',
            'harga' => 44000,
            'tgl_surat_keputusan' => '2017-08-13',
            'no_surat_puskurbuk' => 'SK. B498/H3.3/PB/2017, tgl. 13 Agust. 2017',
            'catatan' => 950,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
