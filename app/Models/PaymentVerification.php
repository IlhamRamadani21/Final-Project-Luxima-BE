<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentVerification extends Model
{
    protected $fillable = [
        'transaction_id',
        'bukti_pembayaran',
        'tanggal_transfer',
        'payment_method',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
