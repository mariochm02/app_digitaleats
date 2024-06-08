<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPVItem extends Model
{
    use HasFactory;

        protected $table = 'tpv_items';
    protected $fillable = ['name', 'price'];
}

