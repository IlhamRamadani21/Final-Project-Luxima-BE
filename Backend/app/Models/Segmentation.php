<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Genre;

class Segmentation extends Model
{
    protected $fillable = ['segmentasi'];

<<<<<<< HEAD
    public function genres(): HasMany
    {
        return $this->hasMany(Genre::class, 'segmentasi_id');
=======
    public function books()
    {
        return $this->hasMany(Book::class, 'segmentasi_id');
>>>>>>> a0e323f511504532c3521b8124a51dcd7842bb06
    }
}
