import { SaveJobButton } from '@/components/jobs/save-job-button';
import { ShareJobButton } from '@/components/jobs/share-job-button';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { JobListingWithRelations } from '@/types/job-listing';
import { Head, Link, usePage } from '@inertiajs/react';
import { BadgeCheck, MapPinIcon, Pencil, SquareArrowOutUpRight } from 'lucide-react';
import React from 'react';

interface JobShowProps {
    job: JobListingWithRelations;
    isSaved: boolean;
}

export default function JobShow({ job, isSaved }: JobShowProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const isStaff = user?.role === 'admin' || user?.role === 'editor';

    console.log(job);

    const formatDate = (dateString: string) => {
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
            return 'Salary not specified';
        }
    };

    const EmploymentTypeMap: Record<string, string> = {
        full_time: 'Full-time',
        part_time: 'Part-time',
        contract: 'Contract',
    };

    const handleApplyClick = () => {
        const link = job.external_link;
        if (link) {
            if (link.startsWith('mailto:')) {
                window.location.href = link;
            } else {
                window.open(link, '_blank', 'noopener,noreferrer');
            }
        }
    };

    return (
        <>
            <Head title={`${job.title} at ${job.law_firm?.name || 'Company'}`} />

            <div className="min-h-screen bg-gray-50 pb-16">
                {/* Staff Edit Banner */}
                {isStaff && (
                    <div className="border-b border-blue-200 bg-blue-50">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
                            <span className="text-sm text-blue-700">
                                You are viewing this page as {user?.role === 'admin' ? 'an admin' : 'an editor'}
                            </span>
                            <Link
                                href={`/admin/job-listings/${job.id}/edit`}
                                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Listing
                            </Link>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="border-b bg-white">
                    <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6">
                        <Link href="/jobs" className="mb-6 inline-flex max-w-fit items-center text-sm text-gray-600 hover:text-gray-900">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Jobs
                        </Link>

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {/* Company Logo */}
                                    <div className="flex h-18 w-18 flex-shrink-0 items-start justify-center overflow-hidden rounded-lg border bg-white">
                                        {job.law_firm?.logo_url ? (
                                            <img src={job.law_firm.logo_url} alt={`${job.law_firm.name} logo`} className="h-14 w-14 object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-600">
                                                {job.law_firm?.name
                                                    ?.split(' ')
                                                    .map((w: string) => w[0])
                                                    .join('')
                                                    .slice(0, 2) || 'CO'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="sm:text-left">
                                        <h1 className="mb-2 text-3xl font-bold text-gray-900">{job.title}</h1>
                                        {job.law_firm && (
                                            <Link
                                                href={`/law-firms/${job.law_firm.slug}`}
                                                className="text-xl text-amber-600 hover:text-amber-700 hover:underline"
                                            >
                                                {job.law_firm.name}
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Job Meta */}
                                <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                                    {job.location && (
                                        <div className="flex items-center">
                                            <MapPinIcon className="mr-2 h-4 w-4" />
                                            <span>{job.location?.name}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        {/* <DollarSignIcon className="mr-2 h-4 w-4" /> */}
                                        {formatSalary()}
                                    </div>

                                    {job.experience_level && (
                                        <div className="flex items-center">
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            {job.experience_level}
                                        </div>
                                    )}

                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                                            job.employment_type === 'full_time' && 'bg-green-100 text-green-800',
                                            job.employment_type === 'part_time' && 'bg-blue-100 text-blue-800',
                                            job.employment_type === 'contract' && 'bg-yellow-100 text-yellow-800',
                                        )}
                                    >
                                        {EmploymentTypeMap[job.employment_type]}
                                    </span>

                                    {!job.is_active && (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                                            Closed
                                        </span>
                                    )}
                                </div>

                                {/* Practice Areas */}
                                {job.practice_areas && job.practice_areas.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {job.practice_areas.map((area) => (
                                            <span
                                                key={area.id}
                                                className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800"
                                            >
                                                {area.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Job Stats */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
                                    <span>Posted {formatDate(job.created_at)}</span>
                                    {job.closing_date && <span>Closes {formatDate(job.closing_date)}</span>}
                                    {/* {job.applications && <span>{job.applications} applications</span>} */}
                                </div>
                            </div>

                            {/* Apply / Share Actions */}
                            <div className="flex w-full max-w-md flex-col space-y-3 md:items-end lg:ml-6 lg:flex-shrink-0">
                                {job.is_active ? (
                                    job.external_link && (
                                        <Button
                                            onClick={handleApplyClick}
                                            variant="default"
                                            className="w-full max-w-[224px] bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                                        >
                                            Apply Now
                                            {/* <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg> */}
                                            <SquareArrowOutUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-md bg-gray-400 px-8 py-3 text-base font-medium text-white shadow-sm"
                                    >
                                        Applications Closed
                                    </button>
                                )}

                                <SaveJobButton jobId={job.id} isSaved={isSaved} size="lg" className="w-full max-w-[224px]" />

                                <ShareJobButton
                                    title={`${job.title} at ${job.law_firm?.name || 'Solicitor Jobs'}`}
                                    summary={job.excerpt || job.location?.name || null}
                                    relativePath={`/jobs/${job.slug}`}
                                    buttonVariant="outline"
                                    buttonSize="lg"
                                    className="w-full max-w-[224px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Job Description */}
                            <section>
                                <h2 className="mb-4 text-xl font-semibold text-gray-900">Job Description</h2>
                                <div className="prose max-w-none prose-gray">
                                    {/* <p className="leading-relaxed whitespace-pre-line text-gray-700">{job.description}</p> */}
                                    {job.description && (
                                        <div className="prose max-w-none prose-gray" dangerouslySetInnerHTML={{ __html: job.description }} />
                                    )}
                                </div>
                            </section>

                            {/* Requirements */}
                            {job.requirements && job.requirements.length > 0 && (
                                <section>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Requirements</h2>
                                    <ul className="space-y-3">
                                        {job.requirements.map((requirement, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <svg className="mt-1 h-4 w-4 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-gray-700">{requirement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Benefits */}
                            {job.benefits && job.benefits.length > 0 && (
                                <section>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Benefits</h2>
                                    <ul className="space-y-3">
                                        {job.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <svg className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-gray-700">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Apply */}
                            {job.external_link && (
                                <div className="rounded-lg border bg-white p-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Ready to Apply?</h3>
                                    <div>
                                        <p className="mb-4 text-sm text-gray-600">Contact the employer directly to apply for this position.</p>
                                        <a
                                            href={job.external_link}
                                            target="_blank"
                                            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-[#a32245] px-4 py-2 text-base font-semibold text-white hover:bg-[#af2449] focus:ring-2 focus:ring-[#3a8bd1] focus:outline-none"
                                        >
                                            Apply Now
                                            <SquareArrowOutUpRight className="ml-2 h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Job Details */}
                            <div className="rounded-lg border bg-white p-6">
                                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-900">Job Details</h3>
                                <dl className="space-y-3">
                                    {job.location && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="text-sm text-gray-900">{job.location?.name}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                                        <dd className="text-sm text-gray-900">{job.workplace_type}</dd>
                                    </div>
                                    {job.experience_level && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                                            <dd className="text-sm text-gray-900">{job.experience_level}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Salary</dt>
                                        <dd className="text-sm text-gray-900">{formatSalary()}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Posted</dt>
                                        <dd className="text-sm text-gray-900">{formatDate(job.created_at)}</dd>
                                    </div>
                                    {job.closing_date && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                                            <dd className="text-sm text-gray-900">{formatDate(job.closing_date)}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Company Info */}
                            {job.law_firm && (
                                <div className="rounded-lg border bg-white p-6">
                                    <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-900">About {job.law_firm.name}</h3>
                                    {job.law_firm.plain_description ? (
                                        <p className="mb-4 text-sm text-gray-700">{job.law_firm.plain_description.slice(0, 200)}</p>
                                    ) : (
                                        <p className="mb-4 text-sm text-gray-500">No company description available.</p>
                                    )}
                                    <Link
                                        href={`/law-firms/${job.law_firm.slug}`}
                                        className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                                    >
                                        View Company Profile
                                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

JobShow.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;
