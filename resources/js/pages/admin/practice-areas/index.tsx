import AdminLayout from '@/layouts/admin-layout';
import { PaginatedResponse } from '@/types/types';
import { Link, router, useForm } from '@inertiajs/react';
import { Briefcase, Building2, Search, Tags } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface PracticeArea {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    job_listings_count: number;
    law_firms_count: number;
    created_at: string;
    parent?: {
        id: number;
        name: string;
    } | null;
}

interface PracticeAreasPageProps {
    areas: PaginatedResponse<PracticeArea>;
    stats: {
        totalFirmUsage: number;
        totalJobUsage: number;
    };
}

const PracticeAreasIndex: React.FC<PracticeAreasPageProps> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({
    areas,
    stats,
}) => {
    const { delete: destroy, processing } = useForm();

    const urlParams = useRef(new URLSearchParams(window.location.search));

    const [search, setSearch] = useState(urlParams.current.get('search') ?? '');
    const [sortBy, setSortBy] = useState(urlParams.current.get('sort_by') ?? 'name');
    const [filterBy, setFilterBy] = useState(urlParams.current.get('filter_by') ?? 'all');

    const isInitialMount = useRef(true);
    const [pendingSortBy, setPendingSortBy] = useState(sortBy);
    const [pendingFilterBy, setPendingFilterBy] = useState(filterBy);

    const buildQuery = useCallback(
        (overrides?: Partial<{ search: string; sort_by: string; filter_by: string }>) => {
            const nextSearch = overrides?.search ?? search;
            const nextSortBy = overrides?.sort_by ?? sortBy;
            const nextFilterBy = overrides?.filter_by ?? filterBy;

            return {
                search: nextSearch.trim() !== '' ? nextSearch : null,
                sort_by: nextSortBy !== 'name' ? nextSortBy : null,
                filter_by: nextFilterBy !== 'all' ? nextFilterBy : null,
            };
        },
        [search, sortBy, filterBy],
    );

    // Debounced search
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            const params = buildQuery({ search });
            const query = new URLSearchParams(
                Object.entries(params)
                    .filter(([, v]) => v !== null)
                    .map(([k, v]) => [k, v as string]),
            ).toString();
            router.get(`/admin/practice-areas${query ? '?' + query : ''}`, {}, { preserveState: true, preserveScroll: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, buildQuery]);

    const applyFilters = () => {
        setSortBy(pendingSortBy);
        setFilterBy(pendingFilterBy);

        const params = buildQuery({
            sort_by: pendingSortBy,
            filter_by: pendingFilterBy,
        });
        const query = new URLSearchParams(
            Object.entries(params)
                .filter(([, v]) => v !== null)
                .map(([k, v]) => [k, v as string]),
        ).toString();

        router.get(`/admin/practice-areas${query ? '?' + query : ''}`, {}, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
            destroy(`/admin/practice-areas/${id}`, { preserveScroll: true });
        }
    };

    const getPaginationInfo = () => {
        const start = (areas.current_page - 1) * areas.per_page + 1;
        const end = Math.min(areas.current_page * areas.per_page, areas.total);
        return `Showing ${start}-${end} of ${areas.total} results`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Practice Areas</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage legal practice areas used by law firms and job listings</p>
                </div>
                <Link
                    href="/admin/practice-areas/create"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Practice Area
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Areas</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{areas.total}</p>
                        </div>
                        <Tags className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Used by Firms</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalFirmUsage}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Used by Jobs</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalJobUsage}</p>
                        </div>
                        <Briefcase className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search practice areas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={pendingFilterBy}
                            onChange={(e) => {
                                setPendingFilterBy(e.target.value);
                                setFilterBy(e.target.value);
                                const params = buildQuery({ filter_by: e.target.value });
                                const query = new URLSearchParams(
                                    Object.entries(params)
                                        .filter(([, v]) => v !== null)
                                        .map(([k, v]) => [k, v as string]),
                                ).toString();
                                router.get(`/admin/practice-areas${query ? '?' + query : ''}`, {}, { preserveState: true, preserveScroll: true });
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Areas</option>
                            <option value="top-level">Top Level Only</option>
                            <option value="with-children">With Children</option>
                            <option value="unused">Unused</option>
                        </select>
                        <select
                            value={pendingSortBy}
                            onChange={(e) => {
                                setPendingSortBy(e.target.value);
                                setSortBy(e.target.value);
                                const params = buildQuery({ sort_by: e.target.value });
                                const query = new URLSearchParams(
                                    Object.entries(params)
                                        .filter(([, v]) => v !== null)
                                        .map(([k, v]) => [k, v as string]),
                                ).toString();
                                router.get(`/admin/practice-areas${query ? '?' + query : ''}`, {}, { preserveState: true, preserveScroll: true });
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="name">Name A-Z</option>
                            <option value="-name">Name Z-A</option>
                            <option value="job_listings_count">Most Used (Jobs)</option>
                            <option value="law_firms_count">Most Used (Firms)</option>
                            <option value="created_at">Latest</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Practice Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Parent Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Job Listings</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Law Firms</th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {areas.data.map((area) => (
                                <tr key={area.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                <Link href={`/admin/practice-areas/${area.id}`} className="hover:text-blue-600">
                                                    {area.name}
                                                </Link>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {area.created_at ? new Date(area.created_at).toLocaleDateString() : '—'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {area.parent ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {area.parent.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Top Level</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {area.job_listings_count} {area.job_listings_count === 1 ? 'job' : 'jobs'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {area.law_firms_count} {area.law_firms_count === 1 ? 'firm' : 'firms'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={`/admin/practice-areas/${area.id}/edit`}
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
                                                onClick={() => handleDelete(area.id, area.name)}
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

                    {!areas.data.length && (
                        <div className="py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No practice areas</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new practice area.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {areas.data.length > 0 && (
                    <div className="border-t border-gray-200 bg-white px-6 py-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-700">{getPaginationInfo()}</div>

                            <nav className="flex items-center space-x-2">
                                {areas.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveState={true}
                                        preserveScroll={true}
                                        className={`rounded-md px-3 py-1 text-sm font-medium ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                  : 'cursor-not-allowed text-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

PracticeAreasIndex.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={[{ label: 'Practice Areas' }]}>{page}</AdminLayout>
);

export default PracticeAreasIndex;
