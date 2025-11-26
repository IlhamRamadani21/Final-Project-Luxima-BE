<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'status',
    ];

    // Relasi ke User (Pelanggan)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Relasi ke Bukti Pembayaran
    public function verification()
    {
        return $this->hasOne(PaymentVerification::class);
    }
}
