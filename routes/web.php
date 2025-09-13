<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoomController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Booking;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/autocomplete', [SearchController::class, 'autocomplete'])->name('autocomplete');

// Guest booking access routes - make sure these are before the resource routes
Route::get('/bookings/guest-access', function (Request $request) {
    return Inertia::render('Bookings/GuestAccess');
})->name('bookings.guest-access');

Route::post('/bookings/guest-access', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'reference' => 'required|string',
    ]);
    
    $booking = Booking::where('reference', $request->reference)
        ->where('guest_email', $request->email)
        ->first();
    
    if (!$booking) {
        return back()->withErrors([
            'error' => 'No booking found with the provided email and reference number.'
        ]);
    }
    
    // Store guest access in session
    session()->put('guest_booking_email', $request->email);
    session()->put('guest_booking_reference', $request->reference);
    
    return redirect()->route('bookings.show', $booking->id);
})->name('bookings.guest-access.submit');

// Keep the resource routes after
Route::resource('bookings', BookingController::class)->only(['create', 'store', 'show']);

// Booking routes (available to both guests and authenticated users)
Route::resource('bookings', BookingController::class)->only(['create', 'store', 'show']);

// Authenticated user routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('bookings', BookingController::class)->only(['index', 'destroy']);
});

// Admin routes with gate middleware
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('hotels', HotelController::class);
    Route::get('/bookings', [BookingController::class, 'adminIndex'])->name('bookings');
});

// // Booking routes
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::resource('bookings', BookingController::class)->only(['index', 'destroy']);
// });

// Admin room routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Hotel routes
    Route::resource('hotels', HotelController::class);
    
    // Room routes
    Route::get('hotels/{hotel}/rooms', [RoomController::class, 'index'])->name('hotels.rooms.index');
    Route::get('hotels/{hotel}/rooms/create', [RoomController::class, 'create'])->name('hotels.rooms.create');
    Route::post('hotels/{hotel}/rooms', [RoomController::class, 'store'])->name('hotels.rooms.store');
    Route::get('hotels/{hotel}/rooms/{room}/edit', [RoomController::class, 'edit'])->name('hotels.rooms.edit');
    Route::put('hotels/{hotel}/rooms/{room}', [RoomController::class, 'update'])->name('hotels.rooms.update');
    Route::delete('hotels/{hotel}/rooms/{room}', [RoomController::class, 'destroy'])->name('hotels.rooms.destroy');
    
    // Booking routes
    Route::get('/bookings', [BookingController::class, 'adminIndex'])->name('bookings');
});

// Public hotel show route
Route::get('/hotels/{hotel}', function (App\Models\Hotel $hotel, Request $request) {
    $hotel->load('rooms');
    
    return Inertia::render('Hotels/Show', [
        'hotel' => $hotel,
        'check_in' => $request->query('check_in'),
        'check_out' => $request->query('check_out'),
        'guests' => $request->query('guests', 1),
    ]);
})->name('hotels.show');

require __DIR__.'/auth.php';
