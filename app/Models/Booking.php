<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'user_id', 'hotel_id', 'room_id',
        'guest_name', 'guest_email', 'guest_phone',
        'check_in', 'check_out', 'guests', 'total_price',
        'currency', 'status', 'special_requests'
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->reference)) {
                $booking->reference = static::generateReference();
            }
        });
    }

    protected static function generateReference()
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $reference = '';
        
        for ($i = 0; $i < 8; $i++) {
            $reference .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        // Ensure uniqueness
        if (static::where('reference', $reference)->exists()) {
            return static::generateReference();
        }
        
        return $reference;
    }
}