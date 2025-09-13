<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Hotel;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class RoomController extends Controller
{
    public function index(Hotel $hotel)
    {
        Gate::authorize('viewAny', Room::class);
        
        $rooms = $hotel->rooms()->get();
        
        return Inertia::render('Admin/Rooms/Index', [
            'hotel' => $hotel,
            'rooms' => $rooms,
        ]);
    }

    public function create(Hotel $hotel)
    {
        Gate::authorize('create', Room::class);
        
        return Inertia::render('Admin/Rooms/Create', [
            'hotel' => $hotel,
        ]);
    }

    public function store(StoreRoomRequest $request, Hotel $hotel)
    {
        Gate::authorize('create', Room::class);
        
        $room = $hotel->rooms()->create($request->validated());
        
        return redirect()->route('admin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Room created successfully.');
    }

    public function edit(Hotel $hotel, Room $room)
    {
        Gate::authorize('update', $room);
        
        return Inertia::render('Admin/Rooms/Edit', [
            'hotel' => $hotel,
            'room' => $room,
        ]);
    }

    public function update(UpdateRoomRequest $request, Hotel $hotel, Room $room)
    {
        Gate::authorize('update', $room);
        
        $room->update($request->validated());
        
        return redirect()->route('admin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Room updated successfully.');
    }

    public function destroy(Hotel $hotel, Room $room)
    {
        Gate::authorize('delete', $room);
        
        $room->delete();
        
        return redirect()->route('admin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Room deleted successfully.');
    }
}