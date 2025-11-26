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
            "kategori"=>"pembelajaran",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"fiksi anak",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"agama",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"non fiksi anak",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"pengetahuan atau sejarah",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"keterampilan",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
        Genre::create([
            "kategori"=>"pendidikan",
            "deskripsi"=>"klncalnvioavoiansvoasnvpanvspnas"
        ]);
    }
}
