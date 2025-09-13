<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;

class HotelSeeder extends Seeder
{
    public function run()
    {
        Hotel::create([
            'name' => 'Grand Palace Hotel',
            'description' => 'Grand Palace Hotel',
            'address' => '123 Main St, Cityville',
            'city' => 'Cityville',
            'country' => 'Countryland',
            // 'rating' => 5,
        ]);

        Hotel::factory()->count(5)->create();
    }
}