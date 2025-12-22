<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request; // Import class Request

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Anda tidak perlu menambah file di sini untuk kasus ini
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // KODE KUNCI: Paksa semua error (termasuk validasi) menjadi JSON
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            return true;
        });
    })->create();
