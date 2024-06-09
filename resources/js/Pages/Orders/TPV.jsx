import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import './tpv.css'; // Asegúrate de que el archivo CSS esté importado

export default function TPV({ order, categories, orderDetails }) {
    const { auth } = usePage().props;

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [kitchenOrders, setKitchenOrders] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        item_id: '',
        quantity: 1,
    });

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
                .listen('OrderStatusUpdated', (data) => {
                    console.log('Order Status Updated:', data);
                    setKitchenOrders(prevOrders => [...prevOrders, data.status]);
                });

            // Emitir evento de prueba al cargar la página TPV
            fetch('/send-test-event')
                .then(response => response.json())
                .then(data => console.log('Test event response:', data))
                .catch(error => console.error('Error triggering test event:', error));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting item_id:", data.item_id);
        post(route('orders.addItem', order.id), {
            onSuccess: () => {
                console.log('Item added successfully');
            },
            onError: (error) => {
                console.log('Error adding item:', error);
            }
        });
    };

    const filteredCategories = categories.filter(category => 
        !selectedCategory || category.name === selectedCategory
    );

    const filteredSubcategories = filteredCategories.flatMap(category =>
        category.subcategories
    ).filter(subcategory =>
        !selectedSubcategory || subcategory.name === selectedSubcategory
    );

    const filteredItems = filteredSubcategories.flatMap(subcategory =>
        subcategory.items
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">TPV - Pedido #{order.id}</h2>}
        >
            <Head title={`TPV - Pedido #${order.id}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1>TPV</h1>
                            <div className="mb-4">
                                <button onClick={() => setSelectedCategory('Bebidas')} className="btn-category mr-2">Bebidas</button>
                                <button onClick={() => setSelectedCategory('Comidas')} className="btn-category mr-2">Comidas</button>
                                <button onClick={() => setSelectedCategory('')} className="btn-category mr-2">Todos</button>
                            </div>
                            {selectedCategory && (
                                <div className="mb-4">
                                    {filteredCategories.flatMap(category => category.subcategories).map(subcategory => (
                                        <button
                                            key={subcategory.id}
                                            onClick={() => setSelectedSubcategory(subcategory.name)}
                                            className="btn-subcategory mr-2"
                                        >
                                            {subcategory.name}
                                        </button>
                                    ))}
                                    <button onClick={() => setSelectedSubcategory('')} className="btn-subcategory mr-2">Todas</button>
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Artículo</label>
                                    <select value={data.item_id} onChange={(e) => setData('item_id', e.target.value)}>
                                        <option value="">Seleccione un artículo</option>
                                        {filteredItems.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} - ${item.price}</option>
                                        ))}
                                    </select>
                                    {errors.item_id && <div className="error">{errors.item_id}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Cantidad</label>
                                    <input type="number" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
                                    {errors.quantity && <div className="error">{errors.quantity}</div>}
                                </div>
                                <button type="submit" className="btn-submit" disabled={processing}>Añadir</button>
                            </form>
                            <h2 className="mt-4">Detalles del Pedido</h2>
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Artículo</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map(detail => (
                                        <tr key={detail.id}>
                                            <td className="border px-4 py-2">{detail.item}</td>
                                            <td className="border px-4 py-2">{detail.quantity}</td>
                                            <td className="border px-4 py-2">${detail.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <strong>Total: ${orderDetails.reduce((total, detail) => total + parseFloat(detail.price), 0).toFixed(2)}</strong>
                            </div>
                            <h2 className="mt-4">Notificaciones de Cocina</h2>
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
