import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

type PracticeArea = {
    id: number;
    name: string;
    parent_id: number | null;
    law_firms_count: number;
    parent?: { id: number; name: string } | null;
};

const Index = () => {
    const { areas } = usePage().props as { areas: PracticeArea[] };
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this practice area?')) {
            destroy(`/admin/practice-areas/${id}`, { method: 'delete', preserveScroll: true });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Practice Areas</h1>
                <Link href="/admin/practice-areas/create" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Add New
                </Link>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Parent</th>
                        <th className="py-2 pr-4">Firms</th>
                        <th className="py-2 pr-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {areas.map((a) => (
                        <tr key={a.id} className="border-b last:border-none">
                            <td className="py-2 pr-4">{a.name}</td>
                            <td className="py-2 pr-4">{a.parent ? a.parent.name : '—'}</td>
                            <td className="py-2 pr-4">{a.law_firms_count}</td>
                            <td className="space-x-3 py-2 pr-4">
                                <Link href={`/admin/practice-areas/${a.id}/edit`} className="text-blue-600 hover:underline">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(a.id)}
                                    disabled={processing}
                                    className="text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {!areas.length && (
                        <tr>
                            <td colSpan={4} className="py-4 text-center text-gray-500">
                                No practice areas yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

Index.layout = (p: React.ReactNode) => <AdminLayout>{p}</AdminLayout>;

export default Index;
