@extends('layouts.admin') {{-- Ganti dengan layout admin nanti --}}

@section('content')
<h1>Detail Verifikasi Pesanan: {{ $transaction->nomor_pesanan }}</h1>

<h2>Detail Pesanan</h2>
<ul>
    <li>**Pelanggan:** {{ $transaction->user->name }}</li>
    <li>**Total Harga:** Rp {{ number_format($transaction->total_harga, 0, ',', '.') }}</li>
    <li>**Status Saat Ini:** {{ $transaction->status }}</li>
</ul>

<h2>Bukti Pembayaran</h2>
@if ($transaction->verification)
    <p>Tanggal Transfer: {{ $transaction->verification->tanggal_transfer ?? 'N/A' }}</p>
    <p>Nama Bank Pengirim: {{ $transaction->verification->payment_method ?? 'N/A' }}</p>
    
    {{-- Tampilkan gambar bukti pembayaran --}}
    <img src="{{ Storage::url($transaction->verification->bukti_pembayaran) }}" alt="Bukti Transfer" style="max-width: 300px; border: 1px solid #ccc;">

    {{-- Form Aksi Verifikasi --}}
    <form action="{{ route('admin.verifications.verify', $transaction) }}" method="POST" style="margin-top: 20px;">
        @csrf
        
        <button type="submit" name="action" value="approve" style="background-color: green; color: white;">SETUJUI PEMBAYARAN</button>
        <button type="submit" name="action" value="reject" style="background-color: red; color: white;">TOLAK PEMBAYARAN</button>
    </form>
@else
    <p>Pelanggan belum mengunggah bukti pembayaran.</p>
@endif

<a href="{{ route('admin.verifications.index') }}">Kembali ke Daftar Verifikasi</a>
@endsection