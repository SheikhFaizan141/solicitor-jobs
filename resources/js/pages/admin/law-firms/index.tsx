import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AdminLayout from '@/layouts/admin-layout';
import { LawFirm } from '@/types/law-firms';
import { PaginatedResponse } from '@/types/types';
import { queryParams } from '@/wayfinder';
import { Link, router, useForm } from '@inertiajs/react';
import { RowSelectionState } from '@tanstack/react-table';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createLawFirmColumns } from './columns';

interface LawFirmsPageProps {
    lawFirms: PaginatedResponse<LawFirm>;
}

const LawFirms = ({ lawFirms }: LawFirmsPageProps) => {
    const { delete: destroy, processing } = useForm();

    const urlParams = useRef(new URLSearchParams(window.location.search));

    const [search, setSearch] = useState(urlParams.current.get('search') ?? '');
    const [sortBy, setSortBy] = useState(urlParams.current.get('sort_by') ?? 'created_at');
    const [statusFilter, setStatusFilter] = useState(urlParams.current.get('status') ?? 'all');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

    const handleBulkDelete = () => {
        const selectedIds = Object.keys(rowSelection)
            .filter((key) => rowSelection[parseInt(key)])
            .map((key) => parseInt(key));

        if (selectedIds.length === 0) return;

        const ids = selectedIds.map((idx) => lawFirms.data[idx].id);
        const count = ids.length;

        if (confirm(`Delete ${count} law firm(s)? This action cannot be undone.`)) {
            setIsBulkDeleting(true);
            router.post(
                '/admin/law-firms/bulk-destroy',
                { ids },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setRowSelection({});
                        setIsBulkDeleting(false);
                    },
                    onError: () => {
                        setIsBulkDeleting(false);
                    },
                },
            );
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
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/law-firms/trash"
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
                    >
                        View Trash
                    </Link>
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
            <div className="space-y-4">
                {/* Bulk Actions Toolbar */}
                {Object.keys(rowSelection).length > 0 && (
                    <div className="sticky top-0 z-10 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 2H7m0 0H5m0 0h2m0 6h2m0 0h-2m0 0h2m6-6h2m0 0h-2m0 0h2m0 6h2m0 0h-2m0 0h2"
                                />
                            </svg>
                            <span className="font-medium text-orange-900">{Object.keys(rowSelection).length} selected</span>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setRowSelection({})}>
                                Clear Selection
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                {isBulkDeleting ? 'Deleting...' : `Delete (${Object.keys(rowSelection).length})`}
                            </Button>
                        </div>
                    </div>
                )}

                <DataTable
                    columns={createLawFirmColumns({
                        onDelete: handleDelete,
                        isProcessing: processing,
                    })}
                    data={lawFirms.data}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                {/* Pagination */}
                <Pagination currentPage={lawFirms.current_page} perPage={lawFirms.per_page} total={lawFirms.total} links={lawFirms.links} />
            </div>
        </div>
    );
};

LawFirms.layout = (page: React.ReactNode) => <AdminLayout breadcrumbs={[{ label: 'Law Firms' }]}>{page}</AdminLayout>;

export default LawFirms;
