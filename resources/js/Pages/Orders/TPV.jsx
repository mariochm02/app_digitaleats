import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Inertia } from '@inertiajs/inertia';
import QRCode from 'qrcode.react';
import './tpv.css';

export default function TPV({ order, categories, orderDetails }) {
    const { auth } = usePage().props;

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [kitchenOrders, setKitchenOrders] = useState([]);
    const [localOrderDetails, setLocalOrderDetails] = useState(orderDetails);
    const [cart, setCart] = useState([]); // Estado del carrito
    const [showQR, setShowQR] = useState(false);

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

            fetch('/send-test-event')
                .then(response => response.json())
                .then(data => console.log('Test event response:', data))
                .catch(error => console.error('Error triggering test event:', error));
        }
    }, []);

    const addToCart = (item) => {
        setCart([...cart, { ...item, quantity: 1 }]);
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

   const addCartToOrder = () => {
    console.log("Carrito enviado:", cart); // Depuración
    axios.post(route('cart.addToOrder', order.id), { cart })
        .then(response => {
            console.log("Respuesta del servidor:", response.data);
            setCart([]); // Limpia el carrito
            Inertia.reload(); // Recargar el pedido
        })
        .catch(error => {
            console.log("Error al añadir el carrito al pedido:", error.response?.data || error.message);
        });
};

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

    const removeItemFromOrder = (orderDetailId) => {
        axios.post(route('orders.removeItem', { order: order.id, orderDetail: orderDetailId }))
            .then(response => {
                Inertia.reload();
            })
            .catch(error => {
                console.log('Error removing item:', error.response.data.errors);
            });
    };

const closeOrderAsPaid = () => {
    axios.post(route('orders.closeAsPaid', order.id))
        .then(response => {
            if (response.data.success) {
                const invoiceUrl = response.data.invoice_url;
                window.open(invoiceUrl, '_blank'); // Abrir el PDF en un pop-up
                Inertia.get(route('orders.index')); // Redirigir a la lista de pedidos
            } else {
                alert('Error al cerrar el pedido: ' + response.data.error);
            }
        })
        .catch(error => {
            console.log('Error closing order:', error.response?.data || error.message);
            alert('Ocurrió un error al cerrar el pedido.');
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

    if (!auth) {
        return (
            <div>
                <h1>No está autorizado para ver esta página.</h1>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">TPV - Pedido #{order.id}</h2>}
        >
            <Head title={`TPV - Pedido #${order.id}`} />
            <div className="py-12 bg-transparent">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-transparent">
                    <div className="bg-transparent neo overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 neo text-white grid">
                            <h1 className='text-center text-white text-4xl'>TPV</h1>
                            <div className="mb-4 flex justify-center">
                                <div>
                                    <button onClick={() => setSelectedCategory('Bebidas')} className="btn-category mr-2">Bebidas</button>
                                    <button onClick={() => setSelectedCategory('Comidas')} className="btn-category mr-2">Comidas</button>
                                    <button onClick={() => setSelectedCategory('')} className="btn-category mr-2">Todos</button>
                                </div>
                            </div>
                            {selectedCategory && (
                                <div className="mb-4 flex justify-center">
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
                            <div className='grid grid-cols-4 gap-4'>
                                {filteredItems.map(item => (
                                    <button key={item.id} onClick={() => addToCart(item)} className="item-button">
                                        <img src={item.image_url} alt={item.name} className="item-image" />
                                        <span>{item.name} - ${item.price}</span>
                                    </button>
                                ))}
                            </div>
                            <h2 className="mt-4">Carrito</h2>
                            <table className="table-auto w-full mt-4 border border-color-white">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Artículo</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.id}>
                                            <td className="border px-4 py-2">{item.name}</td>
                                            <td className="border px-4 py-2">${item.price}</td>
                                            <td className="border px-4 py-2">
                                                <button 
                                                    className="remove-item" 
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button 
                                className="btn btn-primary mt-4"
                                onClick={addCartToOrder}
                            >
                                Añadir al Pedido
                            </button>
                            <h2 className="mt-4">Detalles del Pedido</h2>
                            <table className="table-auto w-full mt-4 border border-color-white">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Artículo</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {localOrderDetails.map(detail => (
                                        <tr key={detail.id}>
                                            <td className="border px-4 py-2">{detail.item}</td>
                                            <td className="border px-4 py-2">${detail.price}</td>
                                            <td className="border px-4 py-2">
                                                <button 
                                                    className="remove-item" 
                                                    onClick={() => removeItemFromOrder(detail.id)}
                                                >
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <strong>Total: ${localOrderDetails.reduce((total, detail) => total + parseFloat(detail.price), 0).toFixed(2)}</strong>
                            </div>
							<br></br>
							 <button 
                                className="btn btn-primary mt-4"
                                onClick={() => setShowQR(true)}
                            >
                                Mesa Cliente
                            </button>
                            {showQR && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <span 
                                            className="close" 
                                            onClick={() => setShowQR(false)}
                                        >&times;</span>
                                        <h2>Código QR para la mesa</h2>
                                        <QRCode value={`http://digitaleats.ddns.net:8080/orders/${order.id}/client-tpv?key=${order.secret_key}`} />
                                    </div>
                                </div>
                            )}
							<br></br>
                            <button 
                                className="btn-close-order"
                                onClick={closeOrderAsPaid}
                            >
                                Cerrar Pedido Pagado
                            </button>
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
