import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface JobListing {
    id: number;
    title: string;
    slug: string;
    law_firm: {
        id: number;
        name: string;
    } | null;
    location: string | null;
    employment_type: string;
    is_active: boolean;
    published_at: string | null;
}

const Index = () => {
    const { jobs } = usePage().props as { jobs: { data: JobListing[]; links: any; meta: any } };
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this job listing?')) {
            destroy(`/admin/job-listings/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Job Listings</h1>
                <Link 
                    href="/admin/job-listings/create" 
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Add New Job
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="py-2 pr-4">Title</th>
                            <th className="py-2 pr-4">Law Firm</th>
                            <th className="py-2 pr-4">Location</th>
                            <th className="py-2 pr-4">Type</th>
                            <th className="py-2 pr-4">Status</th>
                            <th className="py-2 pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.data.map((job) => (
                            <tr key={job.id} className="border-b last:border-none">
                                <td className="py-2 pr-4 font-medium">{job.title}</td>
                                <td className="py-2 pr-4">{job.law_firm?.name || 'Independent'}</td>
                                <td className="py-2 pr-4">{job.location || '—'}</td>
                                <td className="py-2 pr-4 capitalize">{job.employment_type.replace('_', ' ')}</td>
                                <td className="py-2 pr-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {job.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="space-x-3 py-2 pr-4">
                                    <Link 
                                        href={`/admin/job-listings/${job.id}/edit`} 
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        disabled={processing}
                                        className="text-red-600 hover:underline disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!jobs.data.length && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    No job listings yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

Index.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default Index;