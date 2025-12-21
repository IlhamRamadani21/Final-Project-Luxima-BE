<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Genre extends Model
{
<<<<<<< HEAD
    protected $fillable = ['kategori', 'segmentasi_id', 'deskripsi'];

    public function segmentation()
    {
        return $this->belongsTo(Segmentation::class, 'segmentasi_id');
    }
=======
    protected $fillable = ['kategori', 'deskripsi'];
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06

    public function books()
    {
        return $this->hasMany(Book::class, 'kategori_id');
    }
}
