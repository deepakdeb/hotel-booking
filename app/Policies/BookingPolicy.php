<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Booking;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    public function viewAny(User $user)
    {
        return $user->isAdmin() || $user->isUser();
    }

    public function view(?User $user, Booking $booking)
    {
        // Allow admins to view all bookings
        if ($user && $user->isAdmin()) {
            return true;
        }
        
        // Allow authenticated users to view their own bookings
        if ($user && $user->id === $booking->user_id) {
            return true;
        }
        
        // Allow guests to view their booking via session
        $guestEmail = session()->get('guest_booking_email');
        $bookingReference = session()->get('guest_booking_reference');
        
        if ($guestEmail === $booking->guest_email && $bookingReference === $booking->reference) {
            return true;
        }
        
        return false;
    }

    public function create(User $user)
    {
        return true; // Both users and guests can create bookings
    }

    public function update(User $user, Booking $booking)
    {
        return $user->isAdmin() || $user->id === $booking->user_id;
    }

    public function delete(User $user, Booking $booking)
    {
        return $user->isAdmin() || $user->id === $booking->user_id;
    }

    public function restore(User $user, Booking $booking)
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Booking $booking)
    {
        return $user->isAdmin();
    }
}