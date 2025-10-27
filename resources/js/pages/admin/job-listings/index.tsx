import AdminLayout from '@/layouts/admin-layout';
import { JobListing, PaginatedResponse } from '@/types/job-listing';
import { Link, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export interface JobAdminProps {
    jobs: PaginatedResponse<JobListing>;
    can: {
        create: boolean;
    };
}

const JobAdminIndex: React.FC<JobAdminProps> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({ jobs, can }) => {
    const { delete: destroy, processing } = useForm();

    console.log(can);
    

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [statusFilter, setStatusFilter] = useState('all');

    console.log(jobs);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                '/admin/job-listings',
                { search: search, sort_by: sortBy, status: statusFilter },
                { preserveState: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, sortBy, statusFilter]);

    const handleDelete = (id: number) => {
        if (confirm('Delete this job listing?')) {
            destroy(`/admin/job-listings/${id}`, { preserveScroll: true });
        }
    };

    const getPaginationInfo = () => {
        // const { current_page, per_page, total }

        const start = (jobs.current_page - 1) * jobs.per_page + 1;
        const end = Math.min(jobs.current_page * jobs.per_page, jobs.total);
        return `Showing ${start}-${end} of ${jobs.total} results`;
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
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <svg
                                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="search"
                                placeholder="Search jobs by title, location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="created_at">Latest</option>
                            <option value="title">Title A-Z</option>
                            <option value="-title">Title Z-A</option>
                            <option value="location">Location</option>
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
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {job.published_at ? new Date(job.published_at).toLocaleDateString() : 'Draft'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {job.law_firm?.name || <span className="text-gray-400 italic">Independent</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                        {job.location || <span className="text-gray-400">—</span>}
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
                                        <div className="flex justify-end space-x-2">
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
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No job listings</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new job listing.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {jobs.data.length > 0 && (
                    <div className="border-t border-gray-200 bg-white px-6 py-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-700">{getPaginationInfo()}</div>

                            <nav className="flex items-center space-x-2">
                                {jobs.links.map((link, index) => (
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

JobAdminIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default JobAdminIndex;
