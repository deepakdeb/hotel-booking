<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth()->check()) {
            abort(403, 'Unauthorized. Please log in.');
        }

        $user = auth()->user();
        
        if ($role === 'admin' && !$user->isAdmin()) {
            abort(403, 'Admin access required.');
        }
        
        if ($role === 'user' && !$user->isUser()) {
            abort(403, 'User access required.');
        }

        return $next($request);
    }
}