<?php
namespace App\Models;

use App\Models\Author;
use App\Models\Genre;
use App\Models\Segmentation;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
     protected $fillable = [
        'segmentasi_id',
        'judul',
        'kategori_id',
        'isbn',
        'author_id',
        'penerbit',
        'tahun_terbit',
        'ukuran',
        'hal',
        'cover_buku',
        'kertas_cover',
        'kertas_isi',
        'warna_cover',
        'warna_isi',
        'description',
        'harga',
        'stok',
        'tgl_surat_keputusan',
        'no_surat_puskurbuk',
        'catatan',
    ];
    public function segmentasi() {
        return $this->belongsTo(Segmentation::class, 'segmentasi_id');
    }

    public function kategori() {
        return $this->belongsTo(Genre::class, 'kategori_id');
    }

    public function author() {
        return $this->belongsTo(Author::class, 'author_id');
    }
}
