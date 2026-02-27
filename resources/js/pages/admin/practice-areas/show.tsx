import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { Briefcase, Building2, Edit, Tags } from 'lucide-react';

interface PracticeArea {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    parent?: {
        id: number;
        name: string;
    } | null;
    children?: Array<{
        id: number;
        name: string;
    }>;
    law_firms?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    job_listings?: Array<{
        id: number;
        title: string;
        slug: string;
    }>;
}

interface Props {
    practiceArea: PracticeArea;
}

export default function Show({ practiceArea }: Props) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Tags className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">{practiceArea.name}</h1>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>
                            Used by {practiceArea.law_firms?.length || 0} law firm{practiceArea.law_firms?.length !== 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        <span>
                            {practiceArea.job_listings?.length || 0} job listing{practiceArea.job_listings?.length !== 1 ? 's' : ''}
                        </span>
                        {practiceArea.parent && (
                            <>
                                <span>•</span>
                                <span>
                                    Child of{' '}
                                    <Link href={`/admin/practice-areas/${practiceArea.parent.id}`} className="text-blue-600 hover:underline">
                                        {practiceArea.parent.name}
                                    </Link>
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/admin/practice-areas/${practiceArea.id}/edit`}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                    <Link
                        href="/admin/practice-areas"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Back to List
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Law Firms</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{practiceArea.law_firms?.length || 0}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Job Listings</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{practiceArea.job_listings?.length || 0}</p>
                        </div>
                        <Briefcase className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Child Areas</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{practiceArea.children?.length || 0}</p>
                        </div>
                        <Tags className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Child Practice Areas */}
            {practiceArea.children && practiceArea.children.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Tags className="h-5 w-5" />
                            Child Practice Areas
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {practiceArea.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/admin/practice-areas/${child.id}`}
                                    className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Law Firms */}
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Building2 className="h-5 w-5" />
                            Law Firms ({practiceArea.law_firms?.length || 0})
                        </h2>
                    </div>
                    <div className="p-6">
                        {practiceArea.law_firms && practiceArea.law_firms.length > 0 ? (
                            <ul className="space-y-2">
                                {practiceArea.law_firms.map((firm) => (
                                    <li key={firm.id} className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-2">
                                        <Link href={`/admin/law-firms/${firm.id}`} className="text-blue-600 hover:underline">
                                            {firm.name}
                                        </Link>
                                        <Link
                                            href={`/law-firms/${firm.slug}`}
                                            target="_blank"
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            View →
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-gray-500">No law firms using this practice area yet.</p>
                        )}
                    </div>
                </div>

                {/* Job Listings */}
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Briefcase className="h-5 w-5" />
                            Job Listings ({practiceArea.job_listings?.length || 0})
                        </h2>
                    </div>
                    <div className="p-6">
                        {practiceArea.job_listings && practiceArea.job_listings.length > 0 ? (
                            <ul className="space-y-2">
                                {practiceArea.job_listings.map((job) => (
                                    <li key={job.id} className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-2">
                                        <Link href={`/admin/job-listings/${job.id}`} className="text-blue-600 hover:underline">
                                            {job.title}
                                        </Link>
                                        <Link
                                            href={`/jobs/${job.slug}`}
                                            target="_blank"
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            View →
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-gray-500">No job listings using this practice area yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Metadata</h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-600">Created</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {new Date(practiceArea.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {new Date(practiceArea.updated_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-600">Slug</dt>
                        <dd className="mt-1 font-mono text-sm text-gray-900">{practiceArea.slug}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-600">ID</dt>
                        <dd className="mt-1 font-mono text-sm text-gray-900">{practiceArea.id}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => {
    const practiceArea = (page as React.ReactElement<Props>).props.practiceArea;
    return (
        <AdminLayout
            breadcrumbs={[{ label: 'Practice Areas', href: '/admin/practice-areas' }, { label: practiceArea.name }]}
        >
            {page}
        </AdminLayout>
    );
};
