<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\Currency;
use App\Http\Requests\StoreBookingRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Events\NewBookingCreated;
use App\Mail\BookingConfirmation;
use Illuminate\Support\Facades\Mail;


class BookingController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Booking::class);
        
        $user = $request->user();
        $query = Booking::with(['hotel', 'room']);
        
        if ($user && !$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }
        
        $bookings = $query->latest()->get();
        
        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function create(Request $request)
    {
        $hotelId = $request->query('hotel_id');
        $roomId = $request->query('room_id');
        $checkIn = $request->query('check_in');
        $checkOut = $request->query('check_out');
        $guests = $request->query('guests', 1);
        
        $hotel = $hotelId ? Hotel::find($hotelId) : null;
        $room = $roomId ? Room::find($roomId) : null;
        $currencies = Currency::where('is_active', true)->get();
        
        return Inertia::render('Bookings/Create', [
            'hotel' => $hotel,
            'room' => $room,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guests' => $guests,
            'currencies' => $currencies,
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();
        
        // Calculate total price
        $room = Room::find($validated['room_id']);
        $checkIn = Carbon::parse($validated['check_in']);
        $checkOut = Carbon::parse($validated['check_out']);
        $nights = $checkOut->diffInDays($checkIn);
        $basePrice = $room->price * $nights;
        
        // Get currency from database
        $currency = Currency::where('code', $validated['currency'])->first();
        
        if (!$currency) {
            // Fallback to USD if currency not found
            $currency = Currency::where('code', 'USD')->first();
        }
        
        $totalPrice = round($basePrice * $currency->exchange_rate, 2);
        
        // Create booking
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'hotel_id' => $validated['hotel_id'],
            'room_id' => $validated['room_id'],
            'guest_name' => $validated['guest_name'],
            'guest_email' => $validated['guest_email'],
            'guest_phone' => $validated['guest_phone'],
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'total_price' => $totalPrice,
            'currency' => $currency->code,
            'special_requests' => $validated['special_requests'] ?? null,
        ]);
        
        event(new NewBookingCreated($booking));
        // Send confirmation email
        $this->sendConfirmationEmail($booking);
        
        // For guest users, store access in session and redirect to booking page
        if (!auth()->check()) {
            session()->put('guest_booking_email', $booking->guest_email);
            session()->put('guest_booking_reference', $booking->reference);
            
            return redirect()->route('bookings.show', $booking->id)
                ->with('success', 'Booking confirmed! Your reference number is: ' . $booking->reference . '. A confirmation email has been sent.');
        }
        
        return redirect()->route('bookings.show', $booking->id)
            ->with('success', 'Booking confirmed! Your reference number is: ' . $booking->reference . '. A confirmation email has been sent.');

    }

    public function show(Booking $booking)
    {
        //Gate::authorize('view', $booking);
        
        return Inertia::render('Bookings/Show', [
            'booking' => $booking->load(['hotel', 'room']),
        ]);
    }

    public function destroy(Booking $booking)
    {
        Gate::authorize('delete', $booking);
        
        $booking->delete();
        
        return redirect()->route('bookings.index')
            ->with('success', 'Booking cancelled successfully.');
    }

    private function sendConfirmationEmail(Booking $booking)
    {
        try {
            Mail::to($booking->guest_email)->send(new BookingConfirmation($booking));
        } catch (\Exception $e) {
            \Log::error('Failed to send booking confirmation email: ' . $e->getMessage());
            // Continue without throwing error - email failure shouldn't break booking
        }
    }

}