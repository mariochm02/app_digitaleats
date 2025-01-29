import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import "./index.css";

export default function Index({ users: initialUsers, flash, roles }) {
    const { auth } = usePage().props;
    const [users, setUsers] = useState(initialUsers);

    const handleRoleChange = async (userId, newRole) => {
        if (confirm(`¿Está seguro de que quiere cambiar el rol a "${newRole}"?`)) {
            try {
                const response = await fetch(route("users.updateRole", userId), {
                    method: "PUT",
                    headers: {
                        "X-CSRF-Token": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role: newRole }),
                });

                if (response.ok) {
                    console.log("Rol actualizado correctamente");
                    window.location.reload(); // Actualiza la página para reflejar los cambios
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error al actualizar el rol:", error);
            }
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Está seguro de que quiere eliminar este usuario?")) {
            try {
                const response = await fetch(route("users.destroy", id), {
                    method: "DELETE",
                    headers: {
                        "X-CSRF-Token": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    console.log("Usuario eliminado");
                    setUsers((prevUsers) =>
                        prevUsers.filter((user) => user.id !== parseInt(id))
                    );
                } else {
                    console.error("Error al eliminar el usuario");
                }
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-purple-500 leading-tight">
                    Empleados
                </h2>
            }
        >
            <Head title="Empleados" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-white">
                    <div className="neo overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-transparent">
                            {flash && flash.success && <div>{flash.success}</div>}
                            <Link
                                href={route("users.create")}
                                className="editar text-blue-500 mr-2"
                            >
                                Crear Nuevo Empleado
                            </Link>
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Correo</th>
                                        <th className="px-4 py-2">Rol</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="border px-4 py-2">
                                                {user.name}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {user.email}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            user.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-black"
                                                >
                                                    {roles.map((role) => (
                                                        <option
                                                            key={role}
                                                            value={role}
                                                        >
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="border px-4 py-2 flex">
                                                <Link
                                                    href={route(
                                                        "users.edit",
                                                        user.id
                                                    )}
                                                    className="editar text-blue-500 mr-2"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={handleDelete}
                                                    data-id={user.id}
                                                    className="button"
                                                >
                                                    <span>Eliminar</span>
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            stroke-miterlimit="2"
                                                            stroke-linejoin="round"
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                        >
                                                            <path
                                                                fill-rule="nonzero"
                                                                d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
