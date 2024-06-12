import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const { auth, ordersPaidToday, ordersPaidThisMonth, ordersPaidThisYear, revenueToday, revenueThisMonth, revenueThisYear } = usePage().props;

    const ordersData = {
        labels: ['Hoy', 'Este Mes', 'Este Año'],
        datasets: [
            {
                label: 'Pedidos Pagados',
                data: [ordersPaidToday, ordersPaidThisMonth, ordersPaidThisYear],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const revenueData = {
        labels: ['Hoy', 'Este Mes', 'Este Año'],
        datasets: [
            {
                label: 'Ingresos ($)',
                data: [revenueToday, revenueThisMonth, revenueThisYear],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Estadísticas de Pedidos Pagados',
            },
        },
    };

    const revenueOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ingresos Totales ($)',
            },
        },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-purple-500 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="neo text-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-white">
                            <h3 className="text-2xl mb-4">Estadísticas de Pedidos</h3>
                            <div className="chart-container mb-8" style={{ position: 'relative', height: '40vh', width: '80vw' }}>
                                <Bar data={ordersData} options={options} />
                            </div>
                            <h3 className="text-2xl mb-4">Estadísticas de Ingresos</h3>
                            <div className="chart-container" style={{ position: 'relative', height: '40vh', width: '80vw' }}>
                                <Bar data={revenueData} options={revenueOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
