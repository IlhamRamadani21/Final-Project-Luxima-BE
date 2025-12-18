<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Segmentation extends Model
{
    protected $fillable = ['segmentasi'];

    public function categories(): HasMany
    {
        return $this->hasMany(Genre::class, 'segmentasi_id');
    }
}
