import { Pagination } from '@/components/pagination';
import AdminLayout from '@/layouts/admin-layout';
import { LawFirm } from '@/types/law-firms';
import { PaginatedResponse } from '@/types/types';
import { Link, router, useForm } from '@inertiajs/react';
import React from 'react';

interface TrashPageProps {
    lawFirms: PaginatedResponse<LawFirm>;
}

const Trash = ({ lawFirms }: TrashPageProps) => {
    const { processing } = useForm();

    const handleRestore = (id: number, name: string) => {
        if (confirm(`Restore "${name}"?`)) {
            router.post(`/admin/law-firms/${id}/restore`, {}, { preserveScroll: true });
        }
    };

    const handleForceDelete = (id: number, name: string) => {
        if (confirm(`Permanently delete "${name}"? This cannot be undone and will remove all associated data.`)) {
            router.delete(`/admin/law-firms/${id}/force-destroy`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Law Firms — Trash</h1>
                    <p className="mt-1 text-sm text-gray-600">Soft-deleted firms. Restore to make them active again, or permanently delete.</p>
                </div>
                <Link
                    href="/admin/law-firms"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
                >
                    ← Back to Law Firms
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Firm Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Was Active</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Deleted At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {lawFirms.data.map((firm) => (
                                <tr key={firm.id} className="bg-red-50/30 transition-colors hover:bg-red-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{firm.name}</div>
                                        <div className="text-sm text-gray-500">{firm.website || '—'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                firm.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {firm.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                        {firm.deleted_at ? new Date(firm.deleted_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleRestore(firm.id, firm.name)}
                                                disabled={processing}
                                                className="inline-flex items-center text-green-600 transition-colors hover:text-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handleForceDelete(firm.id, firm.name)}
                                                disabled={processing}
                                                className="inline-flex items-center text-red-600 transition-colors hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Delete Permanently
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!lawFirms.data.length && (
                        <div className="py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Trash is empty</h3>
                            <p className="mt-1 text-sm text-gray-500">No soft-deleted law firms found.</p>
                        </div>
                    )}
                </div>

                <Pagination currentPage={lawFirms.current_page} perPage={lawFirms.per_page} total={lawFirms.total} links={lawFirms.links} />
            </div>
        </div>
    );
};

Trash.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={[{ label: 'Law Firms', href: '/admin/law-firms' }, { label: 'Trash' }]}>{page}</AdminLayout>
);

export default Trash;
