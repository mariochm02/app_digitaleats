import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-purple-500 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="neo  text-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-white">Bienvenido!</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}