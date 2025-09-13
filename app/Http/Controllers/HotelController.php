<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Http\Requests\StoreHotelRequest;
use App\Http\Requests\UpdateHotelRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Hotel::class);
        
        $hotels = Hotel::with('rooms')->get();
        
        return Inertia::render('Admin/Hotels/Index', [
            'hotels' => $hotels,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Hotel::class);
        
        return Inertia::render('Admin/Hotels/Create');
    }

    public function store(StoreHotelRequest $request)
    {
        Gate::authorize('create', Hotel::class);
        
        $validated = $request->validated();
        
        // Handle image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('hotel-images', 'public');
                $imagePaths[] = Storage::url($path);
            }
            $validated['images'] = $imagePaths;
        }
        
        $hotel = Hotel::create($validated);
        
        return redirect()->route('admin.hotels.index')
            ->with('success', 'Hotel created successfully.');
    }

    public function show(Hotel $hotel)
    {
        Gate::authorize('view', $hotel);
        
        return Inertia::render('Admin/Hotels/Show', [
            'hotel' => $hotel->load('rooms', 'bookings'),
        ]);
    }

    public function edit(Hotel $hotel)
    {
        Gate::authorize('update', $hotel);
        
        return Inertia::render('Admin/Hotels/Edit', [
            'hotel' => $hotel,
        ]);
    }

    public function update(UpdateHotelRequest $request, Hotel $hotel)
    {
        Gate::authorize('update', $hotel);
        
        $validated = $request->validated();
        
        // Handle image uploads
        if ($request->hasFile('images')) {
            $imagePaths = $hotel->images ?? [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('hotel-images', 'public');
                $imagePaths[] = Storage::url($path);
            }
            $validated['images'] = $imagePaths;
        }
        
        $hotel->update($validated);
        
        return redirect()->route('admin.hotels.index')
            ->with('success', 'Hotel updated successfully.');
    }

    public function destroy(Hotel $hotel)
    {
        Gate::authorize('delete', $hotel);
        
        $hotel->delete();
        
        return redirect()->route('admin.hotels.index')
            ->with('success', 'Hotel deleted successfully.');
    }
}