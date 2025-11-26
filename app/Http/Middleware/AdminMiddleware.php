<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek user sudah login DAN role-nya adalah 'admin'
        if (auth()->check() && auth()->user()->isAdmin()) {
            return $next($request);
        }
        
        // Jika tidak, arahkan ke halaman utama atau pesan error
        return redirect('/')->with('error', 'Akses ditolak. Anda bukan Admin.'); 
        // Bisa ganti redirect atau pesan error sesuai kebutuhan
    }
}
