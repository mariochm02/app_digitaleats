<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OrderDetail;
use App\Models\TPVItem;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::all();
        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'table_number' => 'required|integer',
            'number_of_people' => 'required|integer',
        ]);

        Order::create($validatedData);

        return redirect()->route('orders.index')->with('success', 'Pedido creado exitosamente.');
    }

    public function edit(Order $order)
    {
        return Inertia::render('Orders/Edit', ['order' => $order]);
    }

    public function update(Request $request, Order $order)
    {
        $validatedData = $request->validate([
            'table_number' => 'required|integer',
            'number_of_people' => 'required|integer',
        ]);

        $order->update($validatedData);

        return redirect()->route('orders.index')->with('success', 'Pedido actualizado exitosamente.');
    }

public function deleteOrder($id)
{
    try {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()]);
    }
}

public function tpv(Order $order)
{
    $tpvItems = TPVItem::all();
    $orderDetails = $order->orderDetails;
    return Inertia::render('Orders/TPV', [
        'order' => $order,
        'tpvItems' => $tpvItems,
        'orderDetails' => $orderDetails,
    ]);
}

public function addItem(Request $request, Order $order)
{
    $request->validate([
        'item_id' => 'required|exists:tpv_items,id',
        'quantity' => 'required|integer|min=1',
    ]);

    $tpvItem = TPVItem::find($request->item_id);
    OrderDetail::create([
        'order_id' => $order->id,
        'item' => $tpvItem->name,
        'quantity' => $request->quantity,
        'price' => $tpvItem->price * $request->quantity,
    ]);

    return redirect()->route('orders.tpv', $order);
}

}
