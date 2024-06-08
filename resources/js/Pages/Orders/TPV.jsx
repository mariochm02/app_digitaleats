import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function TPV({ order, tpvItems, orderDetails = [] }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        item_id: '',
        quantity: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.addItem', order.id));
    };

    // Asegúrate de que orderDetails es un arreglo
    const safeOrderDetails = Array.isArray(orderDetails) ? orderDetails : [];

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
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Artículo</label>
                                    <select value={data.item_id} onChange={(e) => setData('item_id', e.target.value)}>
                                        <option value="">Seleccione un artículo</option>
                                        {tpvItems.map(item => (
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
                                <button type="submit" disabled={processing}>Añadir</button>
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
                                    {safeOrderDetails.length > 0 ? (
                                        safeOrderDetails.map(detail => (
                                            <tr key={detail.id}>
                                                <td className="border px-4 py-2">{detail.item}</td>
                                                <td className="border px-4 py-2">{detail.quantity}</td>
                                                <td className="border px-4 py-2">${detail.price}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">No hay detalles del pedido.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <strong>Total: ${safeOrderDetails.reduce((total, detail) => total + detail.price, 0)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
