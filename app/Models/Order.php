<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['table_number', 'number_of_people'];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}


