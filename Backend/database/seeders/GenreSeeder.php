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
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"Fiksi Anak",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"Agama",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"Non Fiksi Anak",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"Pengetahuan atau Sejarah",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"Keterampilan",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"Pendidikan",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
    }
}
