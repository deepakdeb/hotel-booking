<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class StoreBookingRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Both authenticated users and guests can book
    }

    public function rules()
    {
        return [
            'hotel_id' => 'required|exists:hotels,id',
            'room_id' => 'required|exists:rooms,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'required|string|max:20',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1|max:10',
            'special_requests' => 'nullable|string',
            'currency' => 'required|string|size:3',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $checkIn = Carbon::parse($this->check_in);
            $checkOut = Carbon::parse($this->check_out);
            
            if ($checkOut->diffInDays($checkIn) > 30) {
                $validator->errors()->add('check_out', 'Maximum stay is 30 days.');
            }
        });
    }
}