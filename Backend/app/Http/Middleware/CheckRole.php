<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Cek apakah user sudah login (token valid)
        // 2. Cek apakah role user di database sesuai dengan parameter $role
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Akses Ditolak! Area ini khusus untuk ' . $role,
            ], 403); // Error 403: Forbidden/otomatis di tolak
        }

        return $next($request);
    }
}
