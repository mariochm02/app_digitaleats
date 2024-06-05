import React from 'react';
import './users.css';
import { Inertia } from '@inertiajs/inertia';

function UsersComponent(props) {
    const { users, flash } = props;

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this user?")) {
            Inertia.delete(route("users.destroy", id));
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {flash && flash.success && (
                <div>{flash.success}</div>
            )}
            <a href={route("users.create")}>Create New User</a>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className="actions">
                                <a href={route("users.edit", user.id)}>Edit</a>
                                <button className="delete-link" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersComponent;
