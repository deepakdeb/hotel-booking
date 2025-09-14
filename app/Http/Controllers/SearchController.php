<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Booking;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = Hotel::query()->with('rooms');
        
        // Search by string using Scout if query is provided
        if ($request->has('search_text') && !empty($request->search_text)) {
            $query->where(function($q) use ($request) {
                $q->where('city', 'like', '%' . $request->search_text . '%')
                ->orWhere('country', 'like', '%' . $request->search_text . '%')
                ->orWhere('name', 'like', '%' . $request->search_text . '%')
                ->orWhere('description', 'like', '%' . $request->search_text . '%');
            });
        }
        
        // Filter by dates and availability
        if ($request->has('check_in') && $request->has('check_out') && 
            !empty($request->check_in) && !empty($request->check_out)) {
            $checkIn = Carbon::parse($request->check_in);
            $checkOut = Carbon::parse($request->check_out);
            
            // Filter hotels that have available rooms
            $query->whereHas('rooms', function($q) use ($checkIn, $checkOut) {
                $q->whereDoesntHave('bookings', function($bookingQuery) use ($checkIn, $checkOut) {
                    $bookingQuery->where(function($q) use ($checkIn, $checkOut) {
                        $q->whereBetween('check_in', [$checkIn, $checkOut])
                        ->orWhereBetween('check_out', [$checkIn, $checkOut])
                        ->orWhere(function($q) use ($checkIn, $checkOut) {
                            $q->where('check_in', '<=', $checkIn)
                                ->where('check_out', '>=', $checkOut);
                        });
                    })->where('status', 'confirmed');
                });
            });
        }
        
        // Filter by guests
        if ($request->has('guests') && !empty($request->guests)) {
            $query->whereHas('rooms', function($q) use ($request) {
                $q->where('capacity', '>=', (int)$request->guests);
            });
        }
        
        // Filter by price range - only if values are provided and numeric
        if ($request->has('min_price') && is_numeric($request->min_price) && $request->min_price > 0) {
            $query->where('price', '>=', (float)$request->min_price);
        }
        
        if ($request->has('max_price') && is_numeric($request->max_price) && $request->max_price > 0) {
            $query->where('price', '<=', (float)$request->max_price);
        }
        
        // Filter by amenities - only if amenities are provided
        if ($request->has('amenities') && !empty($request->amenities)) {
            $amenities = is_array($request->amenities) ? $request->amenities : [$request->amenities];
            foreach ($amenities as $amenity) {
                if (!empty($amenity)) {
                    $query->whereJsonContains('amenities', $amenity);
                }
            }
        }
        
        $hotels = $query->paginate(12);
        
        // Calculate available rooms for each hotel
        $hotels->getCollection()->transform(function ($hotel) use ($request) {
            $hotel->available_rooms = 0;
            $hotel->min_price = $hotel->rooms->min('price') ?? $hotel->price;
            
            if ($request->has('check_in') && $request->has('check_out') && 
                !empty($request->check_in) && !empty($request->check_out)) {
                $checkIn = Carbon::parse($request->check_in);
                $checkOut = Carbon::parse($request->check_out);
                
                foreach ($hotel->rooms as $room) {
                    $available = $this->calculateAvailableRooms($room, $checkIn, $checkOut);
                    $hotel->available_rooms += $available;
                }
            } else {
                $hotel->available_rooms = $hotel->rooms->sum('quantity');
            }
            
            return $hotel;
        });
        
        return Inertia::render('Search', [
            'hotels' => $hotels,
            'filters' => $request->all(),
        ]);
    }
    
    private function calculateAvailableRooms($room, $checkIn, $checkOut)
    {
        $bookedRooms = Booking::where('room_id', $room->id)
            ->where(function($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                      ->orWhereBetween('check_out', [$checkIn, $checkOut])
                      ->orWhere(function($q) use ($checkIn, $checkOut) {
                          $q->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                      });
            })
            ->where('status', 'confirmed')
            ->count();
        
        return max(0, $room->quantity - $bookedRooms);
    }

    public function search(Request $request)
    {
        $query = $request->get('query');
        
        if (empty($query)) {
            return response()->json([]);
        }
        
        // Use Elasticsearch for search
        $results = Hotel::search($query)->take(10)->get();
        
        return response()->json($results->map(function ($hotel) {
            return [
                'id' => $hotel->id,
                'name' => $hotel->name,
                'city' => $hotel->city,
                'country' => $hotel->country,
                'price' => $hotel->price
            ];
        }));
    }
    
    public function autocomplete(Request $request)
    {
        $query = $request->get('query');
        
        $results = Hotel::where('city', 'like', "%{$query}%")
            ->orWhere('country', 'like', "%{$query}%")
            ->groupBy('city', 'country')
            ->select('city', 'country')
            ->limit(5)
            ->get()
            ->map(function($item) {
                return $item->city . ', ' . $item->country;
            });
            
        return response()->json($results);
    }
}