import AdminLayout from '@/layouts/admin-layout';
import { Pagination } from '@/components/pagination';
import { LawFirm } from '@/types/law-firms';
import { PaginatedResponse } from '@/types/types';
import { queryParams } from '@/wayfinder';
import { Link, router, useForm } from '@inertiajs/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface LawFirmsPageProps {
    lawFirms: PaginatedResponse<LawFirm>;
}

const LawFirms = ({ lawFirms }: LawFirmsPageProps) => {
    const { delete: destroy, processing } = useForm();

    const urlParams = useRef(new URLSearchParams(window.location.search));

    const [search, setSearch] = useState(urlParams.current.get('search') ?? '');
    const [sortBy, setSortBy] = useState(urlParams.current.get('sort_by') ?? 'created_at');
    const [statusFilter, setStatusFilter] = useState(urlParams.current.get('status') ?? 'all');

    const isInitialSearchMount = useRef(true);
    const [pendingSortBy, setPendingSortBy] = useState(sortBy);
    const [pendingStatusFilter, setPendingStatusFilter] = useState(statusFilter);

    const buildQuery = useCallback(
        (overrides?: Partial<{ search: string; sort_by: string; status: string }>) => {
            const nextSearch = overrides?.search ?? search;
            const nextSortBy = overrides?.sort_by ?? sortBy;
            const nextStatus = overrides?.status ?? statusFilter;

            return {
                search: nextSearch.trim() !== '' ? nextSearch : null,
                sort_by: nextSortBy !== 'created_at' ? nextSortBy : null,
                status: nextStatus !== 'all' ? nextStatus : null,
            };
        },
        [search, sortBy, statusFilter],
    );

    // Debounced search only
    useEffect(() => {
        if (isInitialSearchMount.current) {
            isInitialSearchMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(`/admin/law-firms${queryParams({ query: buildQuery({ search }) })}`, {}, { preserveState: true, preserveScroll: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, buildQuery]);

    const applyFilters = () => {
        setSortBy(pendingSortBy);
        setStatusFilter(pendingStatusFilter);

        router.get(
            `/admin/law-firms${queryParams({
                query: buildQuery({
                    sort_by: pendingSortBy,
                    status: pendingStatusFilter,
                }),
            })}`,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
            destroy(`/admin/law-firms/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Law Firms</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage law firms and their information</p>
                </div>
                <Link
                    href="/admin/law-firms/create"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Firm
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <span className="">
                                <svg
                                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="search"
                                placeholder="Search firms by name, location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={pendingStatusFilter}
                            onChange={(e) => setPendingStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={pendingSortBy}
                            onChange={(e) => setPendingSortBy(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="created_at">Latest</option>
                            <option value="name">Name A-Z</option>
                            <option value="-name">Name Z-A</option>
                        </select>

                        <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Apply filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Firm Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {lawFirms.data.map((firm) => (
                                <tr key={firm.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{firm.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {firm.created_at ? new Date(firm.created_at).toLocaleDateString() : '—'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {firm.location || <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm text-gray-900">{firm.phone || <span className="text-gray-400">—</span>}</div>
                                            <div className="text-sm text-gray-500">{firm.email || <span className="text-gray-400">—</span>}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                firm.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {firm.is_active !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={`/admin/law-firms/${firm.id}`}
                                                className="inline-flex items-center text-gray-600 transition-colors hover:text-gray-900"
                                            >
                                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/law-firms/${firm.id}/edit`}
                                                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-900"
                                            >
                                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(firm.id, firm.name)}
                                                disabled={processing}
                                                className="inline-flex items-center text-red-600 transition-colors hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                                Delete
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
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No law firms</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new law firm.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={lawFirms.current_page}
                    perPage={lawFirms.per_page}
                    total={lawFirms.total}
                    links={lawFirms.links}
                />
            </div>
        </div>
    );
};

LawFirms.layout = (page: React.ReactNode) => <AdminLayout breadcrumbs={[{ label: 'Law Firms' }]}>{page}</AdminLayout>;

export default LawFirms;
