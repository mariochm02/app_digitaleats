<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user)
    {
        // Solo los administradores pueden ver la lista de usuarios
        return $user->role === 'admin';
    }

    public function create(User $user)
    {
        // Solo los administradores pueden crear usuarios
        return $user->role === 'admin';
    }

    public function update(User $user)
    {
        // Solo los administradores pueden actualizar usuarios
        return $user->role === 'admin';
    }

    public function delete(User $user)
    {
        // Solo los administradores pueden eliminar usuarios
        return $user->role === 'admin';
    }
}
