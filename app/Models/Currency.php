<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'symbol', 'exchange_rate', 'is_active'
    ];

    public function convertAmount($amount)
    {
        return round($amount * $this->exchange_rate, 2);
    }
}