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
use Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $stats = [];
        $recentBookings = [];

        if ($user->isAdmin()) {
            $stats = [
                'total_hotels' => Hotel::count(),
                'total_bookings' => Booking::count(),
                'pending_bookings' => Booking::where('status', 'pending')->count(),
                'total_revenue' => Booking::where('status', 'confirmed')->sum('total_price'),
            ];
            $recentBookings = Booking::with('hotel')->latest()->limit(5)->get();
        } else {
            $recentBookings = Booking::with('hotel')
                ->where('user_id', $user->id)
                ->latest()
                ->limit(5)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
        ]);
        
    }
}