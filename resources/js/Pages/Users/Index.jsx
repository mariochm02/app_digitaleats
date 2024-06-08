import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ users, flash }) {
    const { auth } = usePage().props;

    const handleDelete = async (e) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            try {
                const response = await fetch(route('users.destroy', id), {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    console.log('Usuario eliminado');
                } else {
                    console.error('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            } finally {
                // Recargar la página después de 0.5 segundos independientemente del resultado
                setTimeout(() => {
                    window.location.reload();
                }, 10);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Empleados</h2>}
        >
            <Head title="Empleados" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1>Empleados</h1>
                            {flash && flash.success && (
                                <div>{flash.success}</div>
                            )}
                            <Link href={route("users.create")} className="text-blue-500">Crear Nuevo Empleado</Link>
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Correo</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="border px-4 py-2">{user.name}</td>
                                            <td className="border px-4 py-2">{user.email}</td>
                                            <td className="border px-4 py-2">
                                                <Link href={route("users.edit", user.id)} className="text-blue-500 mr-2">Editar</Link>
                                                <button onClick={handleDelete} data-id={user.id} className="text-red-500">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
