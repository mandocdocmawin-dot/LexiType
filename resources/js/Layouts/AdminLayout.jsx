import { usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    return (
        <div className="font-body min-h-screen" style={{ backgroundColor: '#0b1326', color: '#dae2fd' }}>
            {children}
        </div>
    );
}
