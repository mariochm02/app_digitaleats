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
	Route::get('/kitchen', [KitchenController::class, 'index'])->name('kitchen.index');
	Route::post('/kitchen/update-status', [KitchenController::class, 'updateStatus'])->name('kitchen.updateStatus');
	Route::get('/send-test-event', [TestBroadcastController::class, 'sendTestEvent']);
	Route::get('/kitchen-orders', [OrderController::class, 'getKitchenOrders']);
Route::put('/kitchen-orders/{id}', [KitchenController::class, 'updateStatus'])->name('kitchen.updateStatus');
Route::put('/orders/{order}/reservation', [OrderController::class, 'updateReservation'])->name('orders.updateReservation');
});

Route::get('/orders/{order}/client-tpv', [OrderController::class, 'clientTpv'])->name('orders.clientTpv');
	Route::post('/orders/{order}/add-item', [OrderController::class, 'addItem'])->name('orders.addItem');
	Route::get('/orders/{order}/tpv', [OrderController::class, 'tpv'])->name('orders.tpv');


require __DIR__.'/auth.php';
