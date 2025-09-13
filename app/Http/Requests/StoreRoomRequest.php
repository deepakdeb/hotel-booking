<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    public function rules()
    {
        return [
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1|max:10',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
        ];
    }
}