<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BackofficeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\TestBroadcastController;
use App\Http\Controllers\DashboardController;
use App\Models\Order;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\File;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/users', function () {
    return Inertia::render('Users/Index');
})->name('users');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/backoffice', [BackofficeController::class, 'index'])->name('backoffice');

// Rutas para la gestión de usuarios
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::put('/users/{user}/update-role', [UserController::class, 'updateRole'])->name('users.updateRole');
Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::delete('/delete-order/{id}', [OrderController::class, 'deleteOrder'])->name('orders.destroy');
	Route::get('/orders/{order}/tpv', [OrderController::class, 'tpv'])->name('orders.tpv');
	Route::post('/orders/{order}/add-item', [OrderController::class, 'addItem'])->name('orders.addItem');
	Route::post('/cart/add', [OrderController::class, 'addToCart'])->name('cart.add');
Route::post('/cart/remove', [OrderController::class, 'removeFromCart'])->name('cart.remove');
Route::post('/cart/addToOrder/{order}', [OrderController::class, 'addCartToOrder'])->name('cart.addToOrder');
	Route::get('/kitchen', [KitchenController::class, 'index'])->name('kitchen.index');
	Route::get('/get-table-number/{orderId}', function ($orderId) {
    $order = Order::find($orderId);
    if ($order) {
        return response()->json(['table_number' => $order->table_number]);
    }
    return response()->json(['table_number' => 'No disponible'], 404);
});
	Route::post('/kitchen/update-status', [KitchenController::class, 'updateStatus'])->name('kitchen.updateStatus');
	Route::get('/kitchen-notifications', [OrderController::class, 'getKitchenNotifications'])->name('orders.kitchen.notifications');
	Route::get('/send-test-event', [TestBroadcastController::class, 'sendTestEvent']);
	Route::get('/kitchen-orders', [OrderController::class, 'getKitchenOrders']);
Route::put('/kitchen-orders/{id}', [KitchenController::class, 'updateStatus'])->name('kitchen.updateStatus');
Route::put('/orders/{order}/reservation', [OrderController::class, 'updateReservation'])->name('orders.updateReservation');
Route::post('/orders/{order}/remove-item/{orderDetail}', [OrderController::class, 'removeItem'])->name('orders.removeItem');
Route::post('/orders/{order}/close-as-paid', [OrderController::class, 'closeAsPaid'])->name('orders.closeAsPaid');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/carta', [ItemController::class, 'index'])->name('items.index');
    Route::get('/carta/create', [ItemController::class, 'create'])->name('items.create');
    Route::post('/carta', [ItemController::class, 'store'])->name('items.store');
    Route::get('/carta/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
    Route::put('/carta/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/carta/{item}', [ItemController::class, 'destroy'])->name('items.destroy');
	Route::get('/invoices', function () {
    $files = File::files(public_path('invoices')); // Obtiene todos los archivos del directorio `public/invoices`
    $invoices = collect($files)->map(function ($file) {
        return [
            'name' => $file->getFilename(),
            'url' => asset('invoices/' . $file->getFilename()), // Genera la URL para acceder al archivo
        ];
    });

    return inertia('Dashboard', [
        'invoices' => $invoices, // Envía las facturas a tu componente React
    ]);
});

});

Route::get('/orders/{order}/client-tpv', [OrderController::class, 'clientTpv'])->name('orders.clientTpv');
	Route::post('/orders/{order}/add-item', [OrderController::class, 'addItem'])->name('orders.addItem');
	Route::get('/orders/{order}/tpv', [OrderController::class, 'tpv'])->name('orders.tpv');


require __DIR__.'/auth.php';
