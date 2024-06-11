import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import './create.css';

export default function Create() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        table_number: '',
        number_of_people: '',
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('Datos antes de enviar:', data); // Depuración
        post(route('orders.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-purple-500 leading-tight">Crear Pedido</h2>}
        >
            <Head title="Crear Pedido" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="neo text-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6  ">
                            <h1>Crear Pedido</h1>
                            <form className='' onSubmit={submit}>
                                <div className="form-group">
                                    <label className='p-7 '>Número de Mesa</label>
                                    <input className='m-6'
                                        type="number"
                                        value={data.table_number}
                                        onChange={(e) => setData('table_number', e.target.value)}
                                    />
                                    {errors.table_number && <div className="error">{errors.table_number}</div>}
                                </div>
                                <div className="form-group ">
                                    <label className='p-7'>Número de Personas</label>
                                    <input className='m-343434'
                                        type="number"
                                        value={data.number_of_people}
                                        onChange={(e) => setData('number_of_people', e.target.value)}
                                    />
                                    {errors.number_of_people && <div className="error">{errors.number_of_people}</div>}
                                </div>
                                <button className='mt-3' type="submit" disabled={processing}>Crear</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
