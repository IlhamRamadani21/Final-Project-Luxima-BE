<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            Cart::create([
                'user_id'=>3,
                'book_id'=>1,
            ]);
        }
    }
