import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import './create.css';

export default function Create() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        dni: '',
    });

    const [dniError, setDniError] = useState("");

    // Función para validar DNI antes de enviar
    const validateDNI = (dni) => {
        const dniRegex = /^\d{8}[A-Z]$/;
        if (!dniRegex.test(dni)) {
            return "El DNI debe tener 8 números seguidos de una letra mayúscula.";
        }

        // Validación de la letra del DNI español
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const numero = parseInt(dni.substring(0, 8), 10);
        const letra = dni.charAt(8);
        if (letras[numero % 23] !== letra) {
            return "La letra del DNI no es correcta.";
        }

        return "";
    };

    const submit = (e) => {
        e.preventDefault();
        
        const dniValidationError = validateDNI(data.dni);
        if (dniValidationError) {
            setDniError(dniValidationError);
            return;
        } else {
            setDniError("");
        }

        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-purple-500 leading-tight">Crear Usuario</h2>}
        >
            <Head title="Crear Usuario" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-transparent overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 transparent">
                            <div id='neo' className="form-container text-white">
                                <h1>Crear Usuario</h1>
                                <form onSubmit={submit}>
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
                                        <label>DNI</label>
                                        <input
                                            type="text"
                                            value={data.dni}
                                            onChange={(e) => setData('dni', e.target.value.toUpperCase())}
                                        />
                                        {dniError && <div className="error">{dniError}</div>}
                                        {errors.dni && <div className="error">{errors.dni}</div>}
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
                                    <button id='boton' type="submit" disabled={processing}>Crear</button>
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
