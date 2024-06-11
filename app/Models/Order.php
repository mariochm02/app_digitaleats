<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str; // Importa la clase Str correctamente

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['table_number', 'number_of_people', 'is_reserved', 'secret_key', 'status'];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->secret_key = Str::random(16); // Genera un key aleatorio de 16 caracteres
        });
    }
}
