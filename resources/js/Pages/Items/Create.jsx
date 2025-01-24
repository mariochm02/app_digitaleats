import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth, items }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        category_id: '',
        subcategory_id: '',
        new_category: '',
        new_subcategory: '',
    });

    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Actualizar subcategorías al cambiar la categoría seleccionada
    useEffect(() => {
        if (data.category_id) {
            const subcategories = items
                .filter((item) => item.subcategory?.category?.id === parseInt(data.category_id))
                .map((item) => item.subcategory)
                .filter(Boolean);

            // Remover duplicados
            const uniqueSubcategories = [
                ...new Map(subcategories.map((subcategory) => [subcategory.id, subcategory])).values(),
            ];
            setFilteredSubcategories(uniqueSubcategories);
            setAlertMessage(''); // Limpiar alerta
        } else {
            setFilteredSubcategories([]);
        }
    }, [data.category_id, items]);

    const handleSubcategoryFocus = () => {
        if (!data.category_id) {
            setAlertMessage('Por favor, selecciona una categoría antes de elegir una subcategoría.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('items.store'));
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Crear Item" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-xl font-semibold">Crear Nuevo Item</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Seleccionar categoría...</option>
                                        {[...new Map(
                                            items
                                                .filter((item) => item.subcategory?.category)
                                                .map((item) => [item.subcategory.category.id, item.subcategory.category])
                                        ).values()].map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-red-500 text-xs italic">{errors.category_id}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Subcategoría</label>
                                    <select
                                        value={data.subcategory_id}
                                        onChange={(e) => setData('subcategory_id', e.target.value)}
                                        onFocus={handleSubcategoryFocus}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Seleccionar subcategoría...</option>
                                        {filteredSubcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.subcategory_id && (
                                        <p className="text-red-500 text-xs italic">{errors.subcategory_id}</p>
                                    )}
                                </div>
                                {alertMessage && (
                                    <p className="text-red-500 text-sm italic mb-4">{alertMessage}</p>
                                )}
                                {/* Crear nueva categoría */}
                                <div className="mb-4">
                                    <button
                                        type="button"
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                        onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                                    >
                                        {showNewCategoryInput ? 'Ocultar Nueva Categoría' : 'Crear Nueva Categoría'}
                                    </button>
                                    {showNewCategoryInput && (
                                        <input
                                            type="text"
                                            placeholder="Nombre de nueva categoría"
                                            value={data.new_category}
                                            onChange={(e) => setData('new_category', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                                        />
                                    )}
                                </div>
                                {/* Crear nueva subcategoría */}
                                <div className="mb-4">
                                    <button
                                        type="button"
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={() => setShowNewSubcategoryInput(!showNewSubcategoryInput)}
                                    >
                                        {showNewSubcategoryInput ? 'Ocultar Nueva Subcategoría' : 'Crear Nueva Subcategoría'}
                                    </button>
                                    {showNewSubcategoryInput && (
                                        <input
                                            type="text"
                                            placeholder="Nombre de nueva subcategoría"
                                            value={data.new_subcategory}
                                            onChange={(e) => setData('new_subcategory', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
