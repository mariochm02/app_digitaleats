<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdated;
use App\Models\KitchenOrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class KitchenController extends Controller
{
    public function index()
    {
		if (!Gate::allows('viewAny', Kitchen::class)) {
            abort(403, 'Acceso no autorizado.');
        }
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
	public function getCompletedOrders()
{
    $orders = KitchenOrderStatus::where('status', 'completed')
        ->with(['order', 'orderDetail'])
        ->get();

    return response()->json([
        'status' => 'success',
        'data' => $orders,
    ]);
}
}
