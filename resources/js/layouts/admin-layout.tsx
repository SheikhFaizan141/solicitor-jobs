import React, { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';

type AdminLayoutProps = {
    children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => (
    <div className="min-h-screen flex bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
            <header className="mb-6 border-b pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Admin Area</h1>
            </header>
            <section className="p-6">
                {children}
            </section>
        </main>
    </div>
);

export default AdminLayout;