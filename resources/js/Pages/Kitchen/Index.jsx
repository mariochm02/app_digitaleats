import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Kitchen({ orders }) {
    const { auth } = usePage().props;
    const [kitchenOrders, setKitchenOrders] = useState(orders);

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
        const intervalId = setInterval(fetchKitchenOrders, 1000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cocina</h2>}
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
                                        Pedido #{order.order_id} - Artículo: {order.order_detail.item} - Estado: {order.status}
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
