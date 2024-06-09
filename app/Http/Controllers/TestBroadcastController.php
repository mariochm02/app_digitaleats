<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\TestEvent;
use App\Models\KitchenOrderStatus;

class TestBroadcastController extends Controller
{
    public function sendTestEvent()
    {
        // Crear un estado de pedido ficticio
        $status = [
            'order_id' => 999,
            'order_detail' => [
                'item' => 'Test Item',
            ],
            'status' => 'test'
        ];

        // Emitir el evento ficticio
        event(new TestEvent($status));

        return response()->json(['message' => 'Test event sent']);
    }
}
