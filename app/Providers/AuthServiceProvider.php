<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Hotel;
use App\Models\Booking;
use App\Policies\HotelPolicy;
use App\Policies\BookingPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Hotel::class => HotelPolicy::class,
        Booking::class => BookingPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();

        // Define a gate for admin access
        Gate::define('admin', function (User $user) {
            return $user->isAdmin();
        });

        // Define a gate for user access
        Gate::define('user', function (User $user) {
            return $user->isUser();
        });
    }
}