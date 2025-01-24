<?php

namespace App\Policies;

use App\Models\User;

class DashboardPolicy
{
    public function access(User $user)
    {
        // Solo los administradores pueden acceder al dashboard
        return $user->role === 'admin';
    }
}
