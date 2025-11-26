<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Author::create([
            "nama" => "Contessa Dewi & Meity H.Idris"
        ]);
        Author::create([
            "nama" => "Zaidan R. Sanami"
        ]);
        Author::create([
            "nama" => "Nurul Ihsan"
        ]);
        Author::create([
            "nama" => "Yoli Hemdi"
        ]);
        Author::create([
            "nama" => "Qorry Aini Rayyan"
        ]);
        Author::create([
            "nama" => "Tristan Ahnaf Wiraatmaja"
        ]);
        Author::create([
            "nama" => "Musyaffa Ahmad Azmi"
        ]);
        Author::create([
            "nama" => "Rulli Nasullah & Enak Supriatna"
        ]);
        Author::create([
            "nama" => "Abu Alkindie, Dkk"
        ]);
    }
}
