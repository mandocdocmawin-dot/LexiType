import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Overview() {
    return (
        <AdminLayout>
            <Head title="Admin Overview" />
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p>Welcome to the admin dashboard. Here you can manage users, view stats, and more.</p>
            </div>
        </AdminLayout>
    );
}
