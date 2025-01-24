import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import './edit.css';

export default function Edit({ order }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        table_number: order.table_number || '',
        number_of_people: order.number_of_people || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('orders.update', order.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Pedido</h2>}
        >
            <Head title="Editar Pedido" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="form-container">
                                <h1>Editar Pedido</h1>
                                <form onSubmit={submit}>
                                    <div>
                                        <label>Número de Mesa</label>
                                        <input
                                            type="number"
                                            value={data.table_number}
                                            onChange={(e) => setData('table_number', e.target.value)}
                                        />
                                        {errors.table_number && <div className="error">{errors.table_number}</div>}
                                    </div>
                                    <div>
                                        <label>Número de Personas</label>
                                        <input
                                            type="number"
                                            value={data.number_of_people}
                                            onChange={(e) => setData('number_of_people', e.target.value)}
                                        />
                                        {errors.number_of_people && <div className="error">{errors.number_of_people}</div>}
                                    </div>
                                    <button type="submit" disabled={processing}>Actualizar</button>
                                </form>
                                <Link href={route('orders.index')} className="text-blue-500 mt-4">Volver a Pedidos</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
