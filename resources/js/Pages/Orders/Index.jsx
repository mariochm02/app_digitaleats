import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ orders, flash }) {
    const { auth } = usePage().props;

    const handleDelete = async (id) => {
        if (confirm("¿Estás seguro de que quieres eliminar este pedido?")) {
            try {
                const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const response = await fetch(`/delete-order/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': token
                    }
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Error al eliminar el pedido');
                }
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pedidos</h2>}
        >
            <Head title="Pedidos" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1>Pedidos</h1>
                            {flash && flash.success && (
                                <div>{flash.success}</div>
                            )}
                            <Link href={route("orders.create")} className="text-blue-500">Crear Nuevo Pedido</Link>
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Número de Mesa</th>
                                        <th className="px-4 py-2">Número de Personas</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="border px-4 py-2">{order.table_number}</td>
                                            <td className="border px-4 py-2">{order.number_of_people}</td>
                                            <td className="border px-4 py-2">
                                                <Link href={route("orders.edit", order.id)} className="text-blue-500 mr-2">Editar</Link>
                                                <button onClick={() => handleDelete(order.id)} className="text-red-500">Eliminar</button>
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
