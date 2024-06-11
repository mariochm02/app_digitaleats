<?php

// app/Http/Controllers/DashboardController.php
namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener la fecha de hoy
        $today = Carbon::today();
        // Obtener el primer día del mes actual
        $startOfMonth = Carbon::now()->startOfMonth();
        // Obtener el primer día del año actual
        $startOfYear = Carbon::now()->startOfYear();

        // Consultar el número de pedidos pagados
        $ordersPaidToday = Order::where('status', 'paid')->whereDate('created_at', $today)->count();
        $ordersPaidThisMonth = Order::where('status', 'paid')->whereBetween('created_at', [$startOfMonth, Carbon::now()])->count();
        $ordersPaidThisYear = Order::where('status', 'paid')->whereBetween('created_at', [$startOfYear, Carbon::now()])->count();

        return Inertia::render('Dashboard', [
            'ordersPaidToday' => $ordersPaidToday,
            'ordersPaidThisMonth' => $ordersPaidThisMonth,
            'ordersPaidThisYear' => $ordersPaidThisYear,
        ]);
    }
}
