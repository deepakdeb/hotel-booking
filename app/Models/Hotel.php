<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Hotel extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name', 'description', 'address', 'city', 'country',
        'postal_code', 'phone', 'email', 'price', 'images', 'amenities'
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'city' => $this->city,
            'country' => $this->country,
            'address' => $this->address,
            'price' => $this->price,
            'amenities' => $this->amenities,
            'created_at' => $this->created_at->timestamp,
            'updated_at' => $this->updated_at->timestamp,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable()
    {
        return true;
    }

    public function getMinPriceAttribute()
    {
        return $this->rooms->min('price') ?? $this->price;
    }
}