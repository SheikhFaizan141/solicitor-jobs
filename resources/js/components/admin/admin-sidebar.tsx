import { Link } from '@inertiajs/react';
import React from 'react';

const AdminSidebar: React.FC = () => (
    <aside className="min-h-screen w-64 bg-gray-800 p-6 text-white">
        <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>
                    <Link className="block px-4 py-2 hover:bg-gray-700" href="/admin/dashboard">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link className="block px-4 py-2 hover:bg-gray-700" href="/admin/law-firms">
                        Law Firms
                    </Link>
                </li>
                <li>
                    <Link className="block px-4 py-2 hover:bg-gray-700" href="/admin/cases">
                        Cases
                    </Link>
                </li>
                <li>
                    <Link className="block px-4 py-2 hover:bg-gray-700" href="/admin/settings">
                        Settings
                    </Link>
                </li>
                <li>
                    <Link className="block px-4 py-2 hover:bg-gray-700" href="/admin/logout">
                        Logout
                    </Link>
                </li>
            </ul>
        </nav>
    </aside>
);

export default AdminSidebar;
