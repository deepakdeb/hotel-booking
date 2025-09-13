<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .footer { background: #eee; padding: 10px; text-align: center; font-size: 12px; }
        .button { background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmation</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $booking->guest_name }},</h2>
            <p>Your booking has been confirmed. Here are your booking details:</p>
            
            <h3>Booking Reference: <strong>{{ $booking->reference }}</strong></h3>
            
            <h4>Hotel Information:</h4>
            <p><strong>{{ $booking->hotel->name }}</strong><br>
            {{ $booking->hotel->address }}, {{ $booking->hotel->city }}, {{ $booking->hotel->country }}</p>
            
            <h4>Booking Details:</h4>
            <p><strong>Room Type:</strong> {{ $booking->room->type }}<br>
            <strong>Check-in:</strong> {{ $booking->check_in->format('M d, Y') }}<br>
            <strong>Check-out:</strong> {{ $booking->check_out->format('M d, Y') }}<br>
            <strong>Guests:</strong> {{ $booking->guests }}<br>
            <strong>Total Price:</strong> {{ $booking->currency }} {{ number_format($booking->total_price, 2) }}</p>
            
            @if($booking->special_requests)
            <h4>Special Requests:</h4>
            <p>{{ $booking->special_requests }}</p>
            @endif

            <p>You can view your booking details anytime by visiting our guest access page:</p>
            <p>
                <a href="{{ $viewLink }}" class="button">Access My Booking</a>
            </p>

            <p>Or by visiting: <br>{{ $viewLink }}</p>
            <p>You'll need your booking reference: <strong>{{ $booking->reference }}</strong></p>
        </div>
        
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; {{ date('Y') }} Hotel Booking Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>