<?php

namespace App\Policies;

use App\Models\User;

class KitchenPolicy
{
    public function viewAny(User $user)
    {
        // Solo los usuarios con el rol de 'cocina' pueden acceder
		return in_array($user->role, ['cocina','admin']);
    }
}
