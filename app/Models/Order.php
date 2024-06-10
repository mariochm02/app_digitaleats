<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['table_number', 'number_of_people', 'is_reserved'];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}


