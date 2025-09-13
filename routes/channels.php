<?php

use App\Models\Booking;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('bookings.{bookingId}', function (User $user, $bookingId) {
    $booking = Booking::find($bookingId);
    return $user->id === $booking->user_id || $user->isAdmin();
});

Broadcast::channel('admin.bookings', function (User $user) {
    return $user->isAdmin();
});