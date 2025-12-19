<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Genre;

class Segmentation extends Model
{
    protected $fillable = ['segmentasi'];

    public function genres(): HasMany
    {
        return $this->hasMany(Genre::class, 'segmentasi_id');
    }
}
