<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Genre::create([
            "kategori"=>"Pembelajaran",
            "segmentasi_id"=>1,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
        Genre::create([
            "kategori"=>"Fiksi Anak",
            "segmentasi_id"=>1,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
        Genre::create([
            "kategori"=>"Agama",
            "segmentasi_id"=>1,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
        Genre::create([
            "kategori"=>"Non Fiksi Anak",
            "segmentasi_id"=>2,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
        Genre::create([
            "kategori"=>"Pengetahuan atau Sejarah",
            "segmentasi_id"=>3,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
        Genre::create([
            "kategori"=>"Keterampilan",
            "segmentasi_id"=>2,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
        Genre::create([
            "kategori"=>"Pendidikan",
            "segmentasi_id"=>3,
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas",
        ]);
    }
}
