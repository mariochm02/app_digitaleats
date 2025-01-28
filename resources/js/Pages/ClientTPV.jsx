import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Inertia } from '@inertiajs/inertia'; // Importar Inertia
import './tpv.css'; // Asegúrate de que el archivo CSS esté importado

export default function ClientTPV({ order, categories, orderDetails }) {
    const query = new URLSearchParams(window.location.search);
    const key = query.get('key');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [kitchenOrders, setKitchenOrders] = useState([]);
    const [localOrderDetails, setLocalOrderDetails] = useState(orderDetails);

    useEffect(() => {
        const pusherKey = '7cfe1320d155f302b914';
        const pusherCluster = 'eu';

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
                    setKitchenOrders(prevOrders => [...prevOrders, data.status]);
                });

            // Emitir evento de prueba al cargar la página TPV
            fetch('/send-test-event')
                .then(response => response.json())
                .then(data => console.log('Test event response:', data))
                .catch(error => console.error('Error triggering test event:', error));
        }
    }, []);

    const addItemToOrder = (itemId) => {
        axios.post(route('orders.addItem', order.id), {
            item_id: itemId,
            quantity: 1
        }).then(response => {
            Inertia.reload();
        }).catch(error => {
            console.log('Error adding item:', error.response.data.errors);
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

    if (!key) {
        return (
            <div>
                <h1>No está autorizado para ver esta página.</h1>
            </div>
        );
    }

    return (
        <div className="py-12 bg-transparent">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-transparent">
                <div className="bg-transparent neo overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 neo text-white grid">
                        <h1 className='text-center text-white text-4xl'>TPV</h1>
                        <div className="mb-4 flex justify-center">
                            <div className='justify-center'>
                                <button onClick={() => setSelectedCategory('Bebidas')} className="btn-category mr-2">Bebidas</button>
                            </div>
                            <div>
                                <button onClick={() => setSelectedCategory('Comidas')} className="btn-category mr-2">Comidas</button>
                            </div>
                            <div>
                                <button onClick={() => setSelectedCategory('')} className="btn-category mr-2">Todos</button>
                            </div>
                        </div>
                        {selectedCategory && (
                            <div className="mb-4 flex justify-center">
                                {filteredCategories.flatMap(category => category.subcategories).map(subcategory => (
                                    <div key={subcategory.id}>
                                        <button
                                            onClick={() => setSelectedSubcategory(subcategory.name)}
                                            className="btn-subcategory mr-2"
                                        >
                                            {subcategory.name}
                                        </button>
                                    </div>
                                ))}
                                <div>
                                    <button onClick={() => setSelectedSubcategory('')} className="btn-subcategory mr-2">Todas</button>
                                </div>
                            </div>
                        )}
                        <div className='grid grid-cols-4 gap-4'>
                            {filteredItems.map(item => (
                                <button key={item.id} onClick={() => addItemToOrder(item.id)} className="item-button">
                                    <img src={item.image_url} alt={item.name} className="item-image" />
                                    <span>{item.name} - ${item.price}</span>
                                </button>
                            ))}
                        </div>
                        <h2 className="mt-4">Detalles del Pedido</h2>
                        <table className="table-auto w-full mt-4 border border-color-white">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Artículo</th>
                                    <th className="px-4 py-2">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localOrderDetails.map(detail => (
                                    <tr key={detail.id}>
                                        <td className="border px-4 py-2">{detail.item}</td>
                                        <td className="border px-4 py-2">${detail.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <strong>Total: ${localOrderDetails.reduce((total, detail) => total + parseFloat(detail.price), 0).toFixed(2)}</strong>
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
    );
}