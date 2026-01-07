import AdminLayout from '@/layouts/admin-layout';
import { JobListing, JobListingWithRelations } from '@/types/job-listing';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface JobAdminShowProps {
    job: JobListingWithRelations;
}

const JobAdminShow: React.FC<JobAdminShowProps> & {
    layout?: (page: React.ReactNode) => React.ReactNode;
} = ({ job }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatSalary = () => {
        const currency =
            job.salary_currency === 'GBP'
                ? '£'
                : job.salary_currency === 'USD'
                  ? '$'
                  : job.salary_currency === 'EUR'
                    ? '€'
                    : job.salary_currency || '';

        if (job.salary_min && job.salary_max) {
            return `${currency}${job.salary_min.toLocaleString()} - ${currency}${job.salary_max.toLocaleString()}`;
        } else if (job.salary_min) {
            return `From ${currency}${job.salary_min.toLocaleString()}`;
        } else if (job.salary_max) {
            return `Up to ${currency}${job.salary_max.toLocaleString()}`;
        } else {
            return 'Not specified';
        }
    };

    return (
        <>
            <Head title={`${job.title} - Job Details`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <Link href="/admin/job-listings" className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Job Listings
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                        {job.law_firm && <p className="mt-1 text-lg text-gray-600">{job.law_firm.name}</p>}
                    </div>
                    <Link
                        href={`/admin/job-listings/${job.id}/edit`}
                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Edit
                    </Link>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Status & Meta */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Status</h2>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {job.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <dl className="space-y-3 divide-y divide-gray-200">
                                <div className="flex justify-between py-2">
                                    <dt className="text-sm font-medium text-gray-600">Posted</dt>
                                    <dd className="text-sm text-gray-900">{formatDate(job.created_at)}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-sm font-medium text-gray-600">Published</dt>
                                    <dd className="text-sm text-gray-900">{formatDate(job.published_at)}</dd>
                                </div>
                                {job.closing_date && (
                                    <div className="flex justify-between py-2">
                                        <dt className="text-sm font-medium text-gray-600">Closing Date</dt>
                                        <dd className="text-sm text-gray-900">{formatDate(job.closing_date)}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Job Details */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Job Details</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-600">Employment Type</dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900">{job.employment_type.replace('_', ' ')}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-600">Workplace Type</dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900">{job.workplace_type.replace('_', ' ')}</dd>
                                </div>
                                {job.experience_level && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-600">Experience Level</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{job.experience_level}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-600">Salary</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatSalary()}</dd>
                                </div>
                                {job.location && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-600">Location</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{job.location.name}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* External Link */}
                        {job.external_link && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">External Link</h2>
                                <a
                                    href={job.external_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center break-all text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    {job.external_link}
                                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-4l8-8" />
                                    </svg>
                                </a>
                            </div>
                        )}

                        {/* Description */}
                        {job.description && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Description</h2>
                                <div className="prose prose-gray max-w-none text-sm" dangerouslySetInnerHTML={{ __html: job.description }} />
                            </div>
                        )}

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Requirements</h2>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                                            <span className="text-gray-400">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Benefits</h2>
                                <ul className="space-y-2">
                                    {job.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                                            <span className="text-green-500">✓</span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Practice Areas */}
                        {job.practice_areas && job.practice_areas.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Practice Areas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.practice_areas.map((area) => (
                                        <span key={area.id} className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                            {area.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">Meta Information</h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-gray-600">Slug</dt>
                                    <dd className="mt-0.5 break-all font-mono text-xs text-gray-900">{job.slug}</dd>
                                </div>
                                {job.law_firm && (
                                    <div>
                                        <dt className="text-gray-600">Law Firm ID</dt>
                                        <dd className="mt-0.5 text-gray-900">{job.law_firm_id}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

JobAdminShow.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default JobAdminShow;