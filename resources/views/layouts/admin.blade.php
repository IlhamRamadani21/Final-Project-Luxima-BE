<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Luxima</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        header { background-color: #333; color: white; padding: 15px; text-align: center; }
        nav { background-color: #555; padding: 10px; }
        nav a { color: white; margin: 0 15px; text-decoration: none; }
        .container { width: 90%; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .alert-success { background-color: #d4edda; color: #155724; padding: 10px; margin-bottom: 15px; border: 1px solid #c3e6cb; border-radius: 4px; }
        .alert-error { background-color: #f8d7da; color: #721c24; padding: 10px; margin-bottom: 15px; border: 1px solid #f5c6cb; border-radius: 4px; }
    </style>
</head>
<body>
    <header>
        <h2>Luxima Admin Panel</h2>
    </header>

    <nav>
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <a href="{{ route('admin.verifications.index') }}">Verifikasi Pembayaran</a>
        
        <form action="{{ route('admin.logout') }}" method="POST" style="display: inline; float: right;">
            @csrf
            <button type="submit" style="background: none; border: none; color: white; cursor: pointer;">Logout</button>
        </form>
    </nav>

    <div class="container">
        {{-- Menampilkan pesan Flash (Success/Error) --}}
        @if (session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="alert-error">{{ session('error') }}</div>
        @endif
        
        @yield('content')
    </div>

</body>
</html>