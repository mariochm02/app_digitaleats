import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import './index.css';

export default function Index({ orders: initialOrders, flash }) {
    const { auth } = usePage().props;
    const [orders, setOrders] = useState(initialOrders);

    useEffect(() => {
        const pusherKey = '7cfe1320d155f302b914';
        const pusherCluster = 'eu';

        console.log('Pusher Key:', pusherKey);
        console.log('Pusher Cluster:', pusherCluster);

        if (pusherKey && pusherCluster) {
            window.Pusher = Pusher;

            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: pusherKey,
                cluster: pusherCluster,
                encrypted: true,
                forceTLS: true
            });

            window.Echo.channel('orders')
                .listen('OrderStatusChanged', (data) => {
                    console.log('Order Status Changed:', data);
                    alert(`Order ${data.order.id} status changed to ${data.status}`);
                });
        }
    }, []);

    const handleDelete = async (e) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        if (confirm("¿Estás seguro de que quieres eliminar este pedido?")) {
            try {
                const response = await fetch(route('orders.destroy', id), {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Content-Type': 'application/json'
                    },
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

    const handleReservationChange = async (orderId, isReserved) => {
        try {
            const response = await axios.put(route('orders.updateReservation', orderId), {
                is_reserved: isReserved
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.data.success) {
                console.log(`Order ${orderId} reservation status updated to ${isReserved}`);
                setOrders(prevOrders => prevOrders.map(order =>
                    order.id === orderId ? { ...order, is_reserved: isReserved } : order
                ));
            } else {
                console.error(`Failed to update reservation status for order ${orderId}`);
            }
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Pedidos</h2>}
        >
            <Head title="Pedidos" />
            <div className="py-12">
                <div className="bg-transparent max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="neo overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-white">Pedidos</h1>
                            {flash && flash.success && (
                                <div>{flash.success}</div>
                            )}
                            <Link href={route("orders.create")} className="text-purple-500">Crear Nuevo Pedido</Link>
                            <table className="table-auto text-white w-full mt-4">
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
                                            <td className="border px-4 py-2 flex items-center">
                                                <Link href={route("orders.edit", order.id)} className="text-blue-500 mr-2">Editar</Link>
                                                <button onClick={handleDelete} data-id={order.id} className="text-red-500 mr-2">Eliminar</button>
                                                <Link href={route("orders.tpv", order.id)} className="text-green-500 mr-2">TPV</Link>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={order.is_reserved}
                                                        onChange={(e) => handleReservationChange(order.id, e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    Reserva
                                                </label>
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
