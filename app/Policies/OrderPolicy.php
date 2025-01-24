<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Order;

class OrderPolicy
{
    /**
     * Determina si el usuario puede acceder a las operaciones de pedidos.
     */
    public function viewAny(User $user)
    {
		return in_array($user->role, ['camarero','admin']);
    }

    public function create(User $user)
    {
        return in_array($user->role, ['camarero','admin']);
    }

    public function update(User $user, Order $order)
    {
        return in_array($user->role, ['camarero','admin']);
    }

    public function delete(User $user, Order $order)
    {
        return in_array($user->role, ['camarero','admin']);
    }
}
