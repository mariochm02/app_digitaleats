<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Aquí puedes definir los atributos que se pueden asignar masivamente
    protected $fillable = [
        'table_number',
        'people_count',
    ];
}

