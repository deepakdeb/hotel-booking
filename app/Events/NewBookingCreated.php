<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewBookingCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking->load('hotel', 'user');
    }

    public function broadcastOn()
    {
        $channels = [
            new PrivateChannel('bookings.' . $this->booking->id),
        ];

        if ($this->booking->user) {
            $channels[] = new PrivateChannel('user.' . $this->booking->user->id . '.bookings');
        }

        // Admin channel for all bookings
        $channels[] = new Channel('admin.bookings');

        return $channels;
    }

    public function broadcastWith()
    {
        return [
            'booking' => [
                'id' => $this->booking->id,
                'reference' => $this->booking->reference,
                'guest_name' => $this->booking->guest_name,
                'check_in' => $this->booking->check_in->format('Y-m-d'),
                'check_out' => $this->booking->check_out->format('Y-m-d'),
                'total_price' => $this->booking->total_price,
                'currency' => $this->booking->currency,
                'hotel' => [
                    'name' => $this->booking->hotel->name,
                    'city' => $this->booking->hotel->city,
                ],
                'created_at' => $this->booking->created_at->toDateTimeString(),
            ]
        ];
    }
}