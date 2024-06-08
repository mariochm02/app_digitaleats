<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OrderDetail;
use App\Models\Item;
use App\Models\Category;
use App\Models\Subcategory;

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
        $categories = Category::with('subcategories.items')->get();
        $orderDetails = $order->orderDetails;
        return Inertia::render('Orders/TPV', [
            'order' => $order,
            'categories' => $categories,
            'orderDetails' => $orderDetails,
        ]);
    }

    public function addItem(Request $request, Order $order)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = Item::find($request->item_id);
        if ($item) {
            \Log::info('Adding item:', ['order_id' => $order->id, 'item_name' => $item->name, 'quantity' => $request->quantity, 'price' => $item->price * $request->quantity]);
            OrderDetail::create([
                'order_id' => $order->id,
                'item' => $item->name,
                'quantity' => $request->quantity,
                'price' => $item->price * $request->quantity,
            ]);
        } else {
            \Log::error('Item not found:', ['item_id' => $request->item_id]);
            return redirect()->route('orders.tpv', $order)->withErrors(['item_id' => 'Item not found']);
        }

        return redirect()->route('orders.tpv', $order);
    }
}
