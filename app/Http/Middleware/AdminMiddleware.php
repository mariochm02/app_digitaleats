<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        dd('admin middleware'); // Añadir esto para verificar

        if (auth()->check() && auth()->user()->is_admin) {
            return $next($request);
        }

        return redirect('/');
    }
}
