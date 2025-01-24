import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import './index.css';

export default function Index({ orders: initialOrders, flash }) {
    const { auth } = usePage().props;
    const [orders, setOrders] = useState(initialOrders);
    const [kitchenNotifications, setKitchenNotifications] = useState([]);
    const [hiddenNotifications, setHiddenNotifications] = useState([]);
    const [tableNumbers, setTableNumbers] = useState({}); // Almacenar números de mesa

    useEffect(() => {
        const storedHiddenNotifications = JSON.parse(localStorage.getItem('hiddenNotifications')) || [];
        setHiddenNotifications(storedHiddenNotifications);

        const fetchKitchenNotifications = () => {
            axios.get('/kitchen-notifications')
                .then(response => {
                    const visibleNotifications = response.data.filter(
                        (notification) => !storedHiddenNotifications.includes(notification.id)
                    );
                    setKitchenNotifications(visibleNotifications);
                })
                .catch(error => {
                    console.error('Error fetching kitchen notifications:', error);
                });
        };

        fetchKitchenNotifications();
        const intervalId = setInterval(fetchKitchenNotifications, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchTableNumber = async (orderId) => {
        if (tableNumbers[orderId]) {
            return tableNumbers[orderId]; // Si ya está cargado
        }
        try {
            const response = await axios.get(`/get-table-number/${orderId}`);
            const tableNumber = response.data.table_number;
            setTableNumbers((prev) => ({ ...prev, [orderId]: tableNumber }));
            return tableNumber;
        } catch (error) {
            console.error(`Error fetching table number for order ${orderId}:`, error);
            return 'No disponible';
        }
    };

    const handleHideNotification = (id) => {
        const newHiddenNotifications = [...hiddenNotifications, id];
        localStorage.setItem('hiddenNotifications', JSON.stringify(newHiddenNotifications));
        setHiddenNotifications(newHiddenNotifications);
        window.location.reload(); // Recargar la página
    };

    const handleShowHidden = () => {
        if (
            confirm(
                `Está usted seguro de mostrar ${hiddenNotifications.length} notificación(es) ocultas?`
            )
        ) {
            localStorage.removeItem('hiddenNotifications');
            setHiddenNotifications([]);
            window.location.reload(); // Recargar la página
        }
    };

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
                    setOrders(prevOrders => prevOrders.filter(order => order.id !== parseInt(id)));
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
            });

            if (response.data.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, is_reserved: isReserved } : order
                    )
                );
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

                            {/* Notificaciones de Cocina */}
                            <div className="mt-6 bg-gray-800 rounded-lg p-4 shadow-md">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-white text-lg mb-4 font-semibold">
                                        Notificaciones de Cocina 
                                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {kitchenNotifications.length}
                                        </span>
                                    </h2>
                                    {hiddenNotifications.length > 0 && (
                                        <button 
                                            onClick={handleShowHidden}
                                            className="text-blue-500 underline text-sm"
                                        >
                                            Mostrar Ocultas ({hiddenNotifications.length})
                                        </button>
                                    )}
                                </div>
                                {kitchenNotifications.length > 0 ? (
                                    <ul className="divide-y divide-gray-600">
                                        {kitchenNotifications.map(notification => (
                                            <li key={notification.id} className="py-2 flex justify-between items-center">
                                                <span>
                                                    Mesa #
                                                    {notification.order?.table_number || 
                                                    tableNumbers[notification.order_id] || 
                                                    (fetchTableNumber(notification.order_id), 'Cargando...')} - 
                                                    Artículo: {notification.order_detail.item} - 
                                                    <span className="text-green-400">{notification.status}</span>
                                                </span>
                                                <button 
                                                    onClick={() => handleHideNotification(notification.id)}
                                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                                                >
                                                    Leído y Ocultar
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">No hay notificaciones de cocina en este momento.</p>
                                )}
                            </div>

                            {/* Tabla de Pedidos */}
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
