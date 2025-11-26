@extends('layouts.admin') {{-- Ganti dengan layout admin nanti --}}

@section('content')
<h1>Verifikasi Pembayaran</h1>

@if (session('success'))
    <div style="color: green;">{{ session('success') }}</div>
@endif
@if (session('error'))
    <div style="color: red;">{{ session('error') }}</div>
@endif

<table>
    <thead>
        <tr>
            <th>No. Pesanan</th>
            <th>Pelanggan</th>
            <th>Total Harga</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($transactions as $transaction)
        <tr>
            <td>{{ $transaction->nomor_pesanan }}</td>
            <td>{{ $transaction->user->name }}</td>
            <td>Rp {{ number_format($transaction->total_harga, 0, ',', '.') }}</td>
            <td>
                <a href="{{ route('admin.verifications.show', $transaction) }}">Lihat & Verifikasi</a>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="4">Tidak ada transaksi yang menunggu verifikasi.</td>
        </tr>
        @endforelse
    </tbody>
</table>
@endsection