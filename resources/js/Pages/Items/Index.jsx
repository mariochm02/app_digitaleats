import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import './items.css';

export default function Index({ items = [], auth }) {
    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Carta" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-xl font-semibold">Carta</h1>
                            {/* Botón para crear un nuevo item */}
                            <Link
                                href={route('items.create')}
                                className="btn btn-primary"
                            >
                                Crear Nuevo Item
                            </Link>

                            {/* Tabla de items */}
                            <table className="table-auto w-full mt-4 border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Nombre</th>
                                        <th className="border px-4 py-2">Precio</th>
                                        <th className="border px-4 py-2">Subcategoría</th>
										<th className="border px-4 py-2">Categoría</th>
                                        <th className="border px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
<tbody>
{items.map((item) => {
    console.log('Item:', item);
    return (
        <tr key={item.id}>
            <td>{item.name}</td>
            <td>{!isNaN(item.price) ? parseFloat(item.price).toFixed(2) : 'Precio no válido'}</td>
            <td>{item.subcategory?.name || 'Sin subcategoría'}</td>
            <td>{item.subcategory?.category?.name || 'Sin categoría'}</td>
            <td className="flex gap-2">
              <Link
    href={route('items.edit', item.id)}
    className="btn btn-secondary"
    onClick={() => {
        // Guardar la categoría y subcategoría temporalmente en el localStorage
        localStorage.setItem('selectedCategory', JSON.stringify(item.subcategory?.category || {}));
        localStorage.setItem('selectedSubcategory', JSON.stringify(item.subcategory || {}));
		console.log('selectedCategory from localStorage:', localStorage.getItem('selectedCategory'));
console.log('selectedSubcategory from localStorage:', localStorage.getItem('selectedSubcategory'));
    }}
>
    Editar
</Link>
                <Link
                    href={route('items.destroy', item.id)}
                    method="delete"
                    as="button"
                    className="btn btn-danger"
                >
                    Eliminar
                </Link>
            </td>
        </tr>
    );
})}
</tbody>                   </table>
                            {items.length === 0 && <p>No hay items disponibles.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
