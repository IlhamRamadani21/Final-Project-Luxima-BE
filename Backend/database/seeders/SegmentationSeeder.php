<?php

namespace Database\Seeders;

use App\Models\Segmentation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SegmentationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Segmentation::create([
            "segmentasi"=>"Usia Dini"
        ]);
        Segmentation::create([
            "segmentasi"=>"Anak"
        ]);
        Segmentation::create([
            "segmentasi"=>"Pengayaan Guru"
        ]);
    }
}
