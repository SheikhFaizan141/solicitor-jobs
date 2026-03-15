import { Pagination } from '@/components/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { JobListingWithRelations } from '@/types/job-listing';
import { PaginatedResponse } from '@/types/types';
import { queryParams } from '@/wayfinder';
import { Link, router, useForm } from '@inertiajs/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface JobAdminProps {
    jobs: PaginatedResponse<JobListingWithRelations>;
    locations: { id: number; name: string }[];
}

const JobAdminIndex = ({ jobs, locations }: JobAdminProps) => {
    const { delete: destroy, processing } = useForm();

    const initialParams = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(initialParams.get('search') ?? '');
    const [sortBy, setSortBy] = useState(initialParams.get('sort_by') ?? 'created_at');
    const [statusFilter, setStatusFilter] = useState(initialParams.get('status') ?? 'all');
    const [locationFilter, setLocationFilter] = useState(initialParams.get('location') ?? 'all');

    const [pendingSortBy, setPendingSortBy] = useState(sortBy);
    const [pendingStatusFilter, setPendingStatusFilter] = useState(statusFilter);
    const [pendingLocationFilter, setPendingLocationFilter] = useState(locationFilter);

    const isInitialSearchMount = useRef(true);

    const buildQuery = useCallback(
        (overrides?: Partial<{ search: string; sort_by: string; status: string; location: string }>) => {
            const nextSearch = overrides?.search ?? search;
            const nextSortBy = overrides?.sort_by ?? sortBy;
            const nextStatus = overrides?.status ?? statusFilter;
            const nextLocation = overrides?.location ?? locationFilter;

            return {
                search: nextSearch.trim() !== '' ? nextSearch : null,
                sort_by: nextSortBy !== 'created_at' ? nextSortBy : null,
                status: nextStatus !== 'all' ? nextStatus : null,
                location: nextLocation !== 'all' ? nextLocation : null,
            };
        },
        [search, sortBy, statusFilter, locationFilter],
    );

    useEffect(() => {
        if (isInitialSearchMount.current) {
            isInitialSearchMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(`/admin/job-listings${queryParams({ query: buildQuery({ search }) })}`, {}, { preserveState: true, preserveScroll: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, buildQuery]);

    const applyFilters = () => {
        setSortBy(pendingSortBy);
        setStatusFilter(pendingStatusFilter);
        setLocationFilter(pendingLocationFilter);

        router.get(
            `/admin/job-listings${queryParams({
                query: {
                    search: search.trim() !== '' ? search : null,
                    sort_by: pendingSortBy !== 'created_at' ? pendingSortBy : null,
                    status: pendingStatusFilter !== 'all' ? pendingStatusFilter : null,
                    location: pendingLocationFilter !== 'all' ? pendingLocationFilter : null,
                },
            })}`,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this job listing?')) {
            destroy(`/admin/job-listings/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage all job listings and their visibility</p>
                </div>
                <Link
                    href="/admin/job-listings/create"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Job
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Search job listings by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pr-4 pl-10 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        />
                    </div>

                    {/* Filter Dropdowns & Button */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-full sm:w-[150px]">
                            <Select onValueChange={(value) => setPendingLocationFilter(value)} defaultValue={pendingLocationFilter}>
                                <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location.id} value={String(location.id)}>
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-[140px]">
                            <Select onValueChange={(value) => setPendingStatusFilter(value)} defaultValue={pendingStatusFilter}>
                                <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-[140px]">
                            <Select onValueChange={(value) => setPendingSortBy(value)} defaultValue={pendingSortBy}>
                                <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Latest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="title">Title A-Z</SelectItem>
                                    <SelectItem value="-title">Title Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                        >
                            Apply Filters
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
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Law Firm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {jobs.data.map((job) => (
                                <tr key={job.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/admin/job-listings/${job.id}`} className="hover:underline">
                                            <div className="text-sm font-medium text-blue-600 hover:text-blue-700">{job.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {job.published_at ? new Date(job.published_at).toLocaleDateString() : 'Draft'}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {job.law_firm?.name ?? <span className="text-gray-400 italic">Independent</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {job.location?.name ?? <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 capitalize">
                                        {job.employment_type.replace('_', ' ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/job-listings/${job.id}`}
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
                                                href={`/admin/job-listings/${job.id}/edit`}
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
                                                onClick={() => handleDelete(job.id)}
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

                    {!jobs.data.length && (
                        <div className="py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No job listings found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or create a new job listing.</p>
                        </div>
                    )}
                </div>

                <Pagination currentPage={jobs.current_page} perPage={jobs.per_page} total={jobs.total} links={jobs.links} />
            </div>
        </div>
    );
};

JobAdminIndex.layout = (page: React.ReactNode) => <AdminLayout breadcrumbs={[{ label: 'Job Listings' }]}>{page}</AdminLayout>;

export default JobAdminIndex;
