<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Hotel;
use Illuminate\Auth\Access\Response;

class HotelPolicy
{
    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    public function view(User $user, Hotel $hotel)
    {
        return $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, Hotel $hotel)
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Hotel $hotel)
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Hotel $hotel)
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Hotel $hotel)
    {
        return $user->isAdmin();
    }
}