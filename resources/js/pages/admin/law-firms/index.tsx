import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import React from 'react';

const LawFirms = () => {
    return (
        <div className="px-4 py-3">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Law Firms</h1>
                <Link href="/admin/law-firms/create">
                    <button className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">Add New Listing</button>
                </Link>
            </div>
            <p>Welcome to the law firms management page.</p>
            {/* <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti molestiae, quod debitis voluptates optio soluta. Quae et modi
                saepe. Sint doloribus cum amet accusamus tempore atque officiis aperiam labore voluptate necessitatibus numquam soluta, explicabo
                velit excepturi accusantium facilis illo maiores.
            </p> */}
            <div className="mt-6 overflow-x-auto">
                
                <table className="min-w-full border border-gray-200 bg-white">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">#</th>
                            <th className="border-b px-4 py-2">Name</th>
                            <th className="border-b px-4 py-2">Location</th>
                            <th className="border-b px-4 py-2">Contact</th>
                            <th className="border-b px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b px-4 py-2">1</td>
                            <td className="border-b px-4 py-2">Smith & Co</td>
                            <td className="border-b px-4 py-2">London</td>
                            <td className="border-b px-4 py-2">01234 567890</td>
                            <td className="border-b px-4 py-2">
                                <button className="mr-2 text-blue-600 hover:underline">Edit</button>
                                <button className="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

LawFirms.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default LawFirms;
