<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Genre extends Model
{
    protected $fillable = ['kategori', 'segmentasi_id', 'deskripsi'];

    public function segmentation()
    {
        return $this->belongsTo(Segmentation::class, 'segmentasi_id');
    }

    public function books()
    {
        return $this->hasMany(Book::class, 'kategori_id');
    }
}
