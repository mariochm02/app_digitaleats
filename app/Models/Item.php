<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'subcategory_id', 'image_url'];

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }
}
