@extends('layouts.admin')

@section('content')
<h1>Dashboard Admin</h1>
<p>Selamat datang, {{ Auth::user()->name }}!</p>
<p>Sekarang Anda bisa <a href="{{ route('admin.verifications.index') }}">melakukan Verifikasi Pembayaran (F-12)</a>.</p>

<form method="POST" action="{{ route('admin.logout') }}">
    @csrf
    <button type="submit">Logout</button>
</form>
@endsection