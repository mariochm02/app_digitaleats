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

    public function updateStatus(Request $request)
    {
        $status = KitchenOrderStatus::find($request->id);
        $status->status = $request->status;
        $status->save();

        broadcast(new OrderStatusUpdated($status));

        return response()->json(['success' => true]);
    }
}
