<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Room;
use Illuminate\Auth\Access\Response;

class RoomPolicy
{
    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    public function view(User $user, Room $room)
    {
        return $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, Room $room)
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Room $room)
    {
        return $user->isAdmin();
    }
}