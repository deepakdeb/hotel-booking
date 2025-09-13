<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $viewLink;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
        $this->viewLink = route('bookings.guest-access');
    }

    public function build()
    {
        return $this->subject('Booking Confirmation - Reference: ' . $this->booking->reference)
                    ->view('emails.booking-confirmation')
                    ->with([
                        'booking' => $this->booking,
                        'viewLink' => $this->viewLink,
                    ]);
    }
}