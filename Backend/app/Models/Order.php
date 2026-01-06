<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'total_price',
        'status',
        'payment_proof',
        'shipping_address',
        'tracking_number'
    ];

    // Relasi: Order punya banyak detail item
    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    // Relasi: Order milik satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}