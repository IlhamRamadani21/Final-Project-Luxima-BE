<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login - Luxima</title>
</head>
<body>
    <h1>Login Administrator</h1>

    @if($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.login') }}">
        @csrf

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <button type="submit">LOGIN</button>
    </form>
    
    <p>Gunakan: admin@luxima.com / password</p>

    {{-- Form Logout (Hanya untuk testing cepat jika sudah login) --}}
    @auth
        <form method="POST" action="{{ route('admin.logout') }}" style="margin-top: 20px;">
            @csrf
            <button type="submit">Logout</button>
        </form>
    @endauth
</body>
</html>