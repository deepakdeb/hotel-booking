<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run()
    {
        $rooms = [
            // Hotel 1 rooms
            [
                'hotel_id' => 1,
                'type' => 'Standard Room',
                'description' => 'Comfortable standard room with all basic amenities',
                'capacity' => 2,
                'price' => 99.99,
                'quantity' => 10,
                'amenities' => ['TV', 'WiFi', 'Air Conditioning'],
            ],
            [
                'hotel_id' => 1,
                'type' => 'Deluxe Room',
                'description' => 'Spacious deluxe room with premium amenities',
                'capacity' => 3,
                'price' => 149.99,
                'quantity' => 5,
                'amenities' => ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Safe'],
            ],
            
            // Hotel 2 rooms
            [
                'hotel_id' => 2,
                'type' => 'Executive Suite',
                'description' => 'Luxurious suite with separate living area',
                'capacity' => 4,
                'price' => 249.99,
                'quantity' => 3,
                'amenities' => ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Safe', 'Coffee Maker'],
            ],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}