<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    protected function redirectTo(Request $request): ?string
    {
        if (! $request->expectsJson()) {

            // Cek apakah request mencoba mengakses rute admin
            if ($request->routeIs('admin.*')) {
                return route('admin.login'); // Arahkan ke rute Admin Login
            }

            // Default untuk rute lain
            return route('login'); // Masih perlu dibuat nanti bagian user/pelanggan
        }

        return null;
    }
}
