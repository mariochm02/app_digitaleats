import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import './edit.css';

export default function Edit({ user }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Editar Usuario</h2>}
        >
            <Head title="Editar Usuario" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-transparent overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-transparet ">
                            <div id='neo' className=" form-container text-white">
                                <h1>Editar Usuario</h1>
                                <form className='' onSubmit={submit}>
                                    <div>
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <div className="error">{errors.name}</div>}
                                    </div>
                                    <div>
                                        <label>Correo</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        {errors.email && <div className="error">{errors.email}</div>}
                                    </div>
                                    <div>
                                        <label>Contraseña</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        {errors.password && <div className="error">{errors.password}</div>}
                                    </div>
                                    <div>
                                        <label>Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                    <button id='boton' type="submit" disabled={processing}>Actualizar</button>
                                </form>
                                <Link href={route('users.index')} className="text-purple-500 mt-4">Volver a Usuarios</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}