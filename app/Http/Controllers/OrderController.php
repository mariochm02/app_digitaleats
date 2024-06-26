<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OrderDetail;
use App\Models\Item;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\KitchenOrderStatus;
use App\Events\OrderStatusUpdated;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
    $orders = Order::where('status', '!=', 'paid')->with('orderDetails.kitchenOrderStatus')->get();
    return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'table_number' => 'required|integer|unique:orders,table_number',
            'number_of_people' => 'required|integer',
        ]);

        $validatedData['secret_key'] = Str::random(10);

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

    public function tpv(Request $request, Order $order)
    {
        if ($request->has('key') && $request->key === $order->secret_key || $request->user()) {
            $categories = Category::with('subcategories.items')->get();
            $orderDetails = $order->orderDetails;
            return Inertia::render('Orders/TPV', [
                'order' => $order,
                'categories' => $categories,
                'orderDetails' => $orderDetails,
            ]);
        } else {
            return redirect()->route('login');
        }
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
            $orderDetail = OrderDetail::create([
                'order_id' => $order->id,
                'item' => $item->name,
                'quantity' => $request->quantity,
                'price' => $item->price * $request->quantity,
            ]);

            if ($item->subcategory->category->name === 'Comidas') {
                \Log::info('Creating kitchen order status', [
                    'order_id' => $order->id,
                    'order_detail_id' => $orderDetail->id,
                    'status' => 'pending',
                ]);

                $kitchenOrderStatus = KitchenOrderStatus::create([
                    'order_id' => $order->id,
                    'order_detail_id' => $orderDetail->id,
                    'status' => 'pending',
                ]);

                \Log::info('Emitting OrderStatusUpdated event with data:', [
                    'order_id' => $kitchenOrderStatus->order_id,
                    'order_detail_id' => $kitchenOrderStatus->order_detail_id,
                    'status' => $kitchenOrderStatus->status,
                ]);
                event(new OrderStatusUpdated($kitchenOrderStatus));
            }

            return redirect()->route('orders.tpv', $order);
        } else {
            \Log::error('Item not found:', ['item_id' => $request->item_id]);
            return redirect()->route('orders.tpv', $order)->withErrors(['item_id' => 'Item not found']);
        }
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $order->status = $request->status;
        $order->save();

        \Log::info('Broadcasting OrderStatusUpdated event for order:', ['order_id' => $order->id, 'status' => $order->status]);
        broadcast(new OrderStatusUpdated($order))->toOthers();

        return response()->json(['success' => true]);
    }

    public function getKitchenOrders()
    {
        $orders = KitchenOrderStatus::with('orderDetail')->where('status', 'pending')->get();
        return response()->json($orders);
    }

    public function updateReservation(Request $request, Order $order)
    {
        $validatedData = $request->validate([
            'is_reserved' => 'required|boolean',
        ]);

        $order->update($validatedData);

        return response()->json(['success' => true, 'order' => $order]);
    }
	public function clientTpv(Request $request, Order $order)
{
    if ($request->has('key') && $request->key === $order->secret_key) {
        $categories = Category::with('subcategories.items')->get();
        $orderDetails = $order->orderDetails;
        return Inertia::render('ClientTPV', [
            'order' => $order,
            'categories' => $categories,
            'orderDetails' => $orderDetails,
        ]);
    } else {
        return redirect()->route('login');
    }
}
public function removeItem(Request $request, Order $order, OrderDetail $orderDetail)
{
    try {
        $orderDetail->delete();
        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()]);
    }
}
public function closeAsPaid(Request $request, Order $order)
{
    try {
        $order->status = 'paid';
        $order->save();
        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()]);
    }
}

}