import React, { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';

type AdminLayoutProps = {
    children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => (
    <div className="min-h-screen flex bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
            <header className="mb-6 border-b pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Admin Area</h1>
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                    title="Go to home page"
                >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                </Link>
            </header>
            <section className="p-6">
                {children}
            </section>
        </main>
    </div>
);

export default AdminLayout;