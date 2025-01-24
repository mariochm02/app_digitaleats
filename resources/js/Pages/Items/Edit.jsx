import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, item, items }) {
    const { data, setData, put, processing, errors } = useForm({
        name: item.name || '',
        price: item.price || '',
        category_id: item.subcategory?.category?.id || '',
        subcategory_id: item.subcategory_id || '',
        new_category: '',
        new_subcategory: '',
    });

    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Evitar conflictos: bandera para indicar si ya se sincronizó la lógica
    const [initialized, setInitialized] = useState(false);

    // Cargar subcategorías al iniciar o cuando cambia la categoría
    useEffect(() => {
        if (data.category_id) {
            const subcategories = items
                .filter((item) => item.subcategory?.category?.id === parseInt(data.category_id))
                .map((item) => item.subcategory)
                .filter(Boolean);

            const uniqueSubcategories = [
                ...new Map(subcategories.map((subcategory) => [subcategory.id, subcategory])).values(),
            ];
            setFilteredSubcategories(uniqueSubcategories);
        }
    }, [data.category_id, items]);

    const handleCategoryChange = (e) => {
        const selectedCategoryId = parseInt(e.target.value);
        setData('category_id', selectedCategoryId);

        const subcategories = items
            .filter((item) => item.subcategory?.category?.id === selectedCategoryId)
            .map((item) => item.subcategory)
            .filter(Boolean);

        const uniqueSubcategories = [
            ...new Map(subcategories.map((subcategory) => [subcategory.id, subcategory])).values(),
        ];

        setFilteredSubcategories(uniqueSubcategories);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('items.update', item.id));
    };

// Lógica para sincronizar categoría al cargar
useEffect(() => {
    if (!initialized) {
        setTimeout(() => {
            const savedCategory = JSON.parse(localStorage.getItem('selectedCategory'));
            console.log('selectedCategory from localStorage:', savedCategory);

            // Actualizar categoría automáticamente
            const categorySelect = document.querySelector('select[name="category_id"]');
            if (categorySelect && savedCategory?.id) {
                categorySelect.value = savedCategory.id;
                setData('category_id', savedCategory.id); // Actualizar en el estado
                categorySelect.dispatchEvent(new Event('change'));
                console.log('Categoría seleccionada automáticamente:', categorySelect.value);
            } else {
                console.error('No se encontró el select de categorías o categoría no válida.');
            }
        }, 500); // Esperar a que el DOM cargue completamente
    }
}, [initialized, setData]);

// Lógica para sincronizar subcategoría al cargar (después de la categoría)
useEffect(() => {
    if (!initialized) {
        setTimeout(() => {
            const savedSubcategory = JSON.parse(localStorage.getItem('selectedSubcategory'));
            console.log('selectedSubcategory from localStorage:', savedSubcategory);

            // Actualizar subcategoría automáticamente
            const subcategorySelect = document.querySelector('select[name="subcategory_id"]');
            if (subcategorySelect && savedSubcategory?.id) {
                subcategorySelect.value = savedSubcategory.id;
                setData('subcategory_id', savedSubcategory.id); // Actualizar en el estado
                subcategorySelect.dispatchEvent(new Event('change'));
                console.log('Subcategoría seleccionada automáticamente:', subcategorySelect.value);
            } else {
                console.error('No se encontró el select de subcategorías o subcategoría no válida.');
            }

            // Marcar como inicializado para evitar conflictos
            setInitialized(true);
        }, 1000); // Añadir un retraso adicional para garantizar la actualización de la categoría primero
    }
}, [initialized, setData]);


    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`Editar ${item.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-xl font-semibold">Editar Item</h1>
                            <form onSubmit={handleSubmit}>
                                {/* Nombre */}
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
                                {/* Precio */}
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
                                {/* Categoría */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                                    <select
                                        name="category_id"
                                        value={data.category_id}
                                        onChange={handleCategoryChange}
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
                                {/* Subcategoría */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Subcategoría</label>
                                    <select
                                        name="subcategory_id"
                                        value={data.subcategory_id}
                                        onChange={(e) => setData('subcategory_id', e.target.value)}
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
                                        Guardar Cambios
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
