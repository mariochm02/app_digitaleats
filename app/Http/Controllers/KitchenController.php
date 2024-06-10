<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdated;
use App\Models\KitchenOrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function index()
    {
        $orders = KitchenOrderStatus::with('order', 'orderDetail')->get();
        return Inertia::render('Kitchen/Index', ['orders' => $orders]);
    }

public function updateStatus($id)
    {
        $orderStatus = KitchenOrderStatus::findOrFail($id);
        $orderStatus->status = 'completed';
        $orderStatus->save();

        return response()->json(['message' => 'Order status updated successfully.']);
    }
}
