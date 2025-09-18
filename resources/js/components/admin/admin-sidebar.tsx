import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

const AdminSidebar: React.FC = () => {
    const [lawFirmsExpanded, setLawFirmsExpanded] = useState(false);

    return (
        <aside className="min-h-screen w-64 bg-gray-800 p-6 text-white">
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link className="block px-4 py-2 hover:bg-gray-700" href="/admin/dashboard">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <div>
                            <button
                                onClick={() => setLawFirmsExpanded(!lawFirmsExpanded)}
                                className="flex w-full items-center justify-between px-4 py-2 hover:bg-gray-700"
                            >
                                <span>Law Firms</span>
                                <span className={`transform transition-transform ${lawFirmsExpanded ? 'rotate-90' : ''}`}>
                                    ▶
                                </span>
                            </button>
                            {lawFirmsExpanded && (
                                <ul className="ml-4 border-l border-gray-600">
                                    <li>
                                        <Link className="block px-4 py-2 text-sm hover:bg-gray-700" href="/admin/law-firms">
                                            All Law Firms
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="block px-4 py-2 text-sm hover:bg-gray-700" href="/admin/practice-areas">
                                            Practice Areas
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
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
};

export default AdminSidebar;