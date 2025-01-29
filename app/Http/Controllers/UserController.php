<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index()
{
    if (!Gate::allows('viewAny', User::class)) {
        abort(403, 'Acceso no autorizado.');
    }

    $users = User::all();
    $roles = ['admin', 'camarero', 'cocina']; // Roles permitidos

    return Inertia::render('Users/Index', [
        'users' => $users,
        'roles' => $roles,
    ]);
}


    public function create()
    {
		
        return Inertia::render('Users/Create');
    }

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'dni' => [
            'required',
            'regex:/^\d{8}[A-Z]$/',
            'unique:users,dni'
        ], // Validación del DNI
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'dni' => strtoupper($request->dni), // Guardamos en mayúsculas
    ]);

    return redirect()->route('users.index')->with('success', 'Usuario creado exitosamente.');
}


    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }
	public function updateRole(Request $request, User $user)
{
    $request->validate([
        'role' => 'required|in:admin,camarero,cocina', // Validar roles permitidos
    ]);

    $user->update([
        'role' => $request->role,
    ]);

    return redirect()->route('users.index')->with('success', 'Rol actualizado correctamente.');
}


public function destroy(User $user)
{
    $user->delete();

    return redirect()->route('users.index')->with('success', 'Usuario eliminado exitosamente.');
}
}
