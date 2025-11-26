<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SegmentationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('segmentations')->insert([
            'segmentasi' => 'Anak-anak',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
