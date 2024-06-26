<?php

// app/Http/Controllers/DashboardController.php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
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

        // Consultar los ingresos de pedidos pagados
        $revenueToday = OrderDetail::whereHas('order', function ($query) use ($today) {
            $query->where('status', 'paid')->whereDate('updated_at', $today);
        })->sum('price');

        $revenueThisMonth = OrderDetail::whereHas('order', function ($query) use ($startOfMonth) {
            $query->where('status', 'paid')->whereBetween('updated_at', [$startOfMonth, Carbon::now()]);
        })->sum('price');

        $revenueThisYear = OrderDetail::whereHas('order', function ($query) use ($startOfYear) {
            $query->where('status', 'paid')->whereBetween('updated_at', [$startOfYear, Carbon::now()]);
        })->sum('price');

        return Inertia::render('Dashboard', [
            'ordersPaidToday' => $ordersPaidToday,
            'ordersPaidThisMonth' => $ordersPaidThisMonth,
            'ordersPaidThisYear' => $ordersPaidThisYear,
            'revenueToday' => $revenueToday,
            'revenueThisMonth' => $revenueThisMonth,
            'revenueThisYear' => $revenueThisYear,
        ]);
    }
}
