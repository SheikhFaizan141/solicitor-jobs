import AdminLayout from '@/layouts/admin-layout';
import { usePage } from '@inertiajs/react';
import React from 'react';

const AdminPanel = () => {
    const { lawFirms } = usePage().props;

    console.log(lawFirms);
    
    return (
        <div style={{ padding: '2rem' }} className="bg-red-500 text-black">
            <h1>Admin Panel</h1>
            <p>Welcome to the admin dashboard.</p>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti molestiae, quod debitis voluptates optio soluta. Quae et modi
                saepe. Sint doloribus cum amet accusamus tempore atque officiis aperiam labore voluptate necessitatibus numquam soluta, explicabo
                velit excepturi accusantium facilis illo maiores.
            </p>
        </div>
    );
};

AdminPanel.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminPanel;
