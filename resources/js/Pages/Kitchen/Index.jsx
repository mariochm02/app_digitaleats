import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import './kitchen.css';

export default function Kitchen({ orders }) {
    const { auth } = usePage().props;
    const [kitchenOrders, setKitchenOrders] = useState(orders);
    const [tableNumbers, setTableNumbers] = useState({}); // Almacena los números de mesa consultados

    useEffect(() => {
        const fetchKitchenOrders = () => {
            axios.get('/kitchen-orders')
                .then(response => {
                    setKitchenOrders(response.data);
                })
                .catch(error => {
                    console.error('Error fetching kitchen orders:', error);
                });
        };

        fetchKitchenOrders(); // Fetch initial data
        const intervalId = setInterval(fetchKitchenOrders, 1000); // Fetch data every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const handleUpdateStatus = (orderId, newStatus) => {
        axios.put(`/kitchen-orders/${orderId}`, { status: newStatus })
            .then(response => {
                setKitchenOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            })
            .catch(error => {
                console.error('Error updating order status:', error);
            });
    };

    const fetchTableNumber = async (orderId) => {
        if (tableNumbers[orderId]) {
            return tableNumbers[orderId]; // Si ya está cargado, devolverlo
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-purple-500 leading-tight">Cocina</h2>}
        >
            <Head title="Cocina" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1>Pedidos de Cocina</h1>
                            <ul>
                                {kitchenOrders.map(order => (
                                    <li key={order.id}>
                                        Numero de mesa #
                                        {
                                            order.order?.table_number || // Si existe, mostrar el número de mesa
                                            tableNumbers[order.order_id] || // Si ya está en caché
                                            (fetchTableNumber(order.order_id), 'Cargando...') // Si no, consultar y mostrar "Cargando..."
                                        } - 
                                        Artículo: {order.order_detail.item} - 
                                        Estado: {order.status}
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                className="mb-4 ml-4 px-4 py-2 bg-green-500 text-white rounded"
                                            >
                                                Marcar como completado
                                            </button>
                                        )}
									</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
