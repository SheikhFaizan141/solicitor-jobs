import Layout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function JobShow() {
    const { auth, job } = usePage<SharedData>().props;

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

    const handleApplyClick = () => {
        if (job.application_url) {
            window.open(job.application_url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <Head title={`${job.title} at ${job.law_firm?.name || 'Company'}`} />
            
            <div className="min-h-screen bg-gray-50 pb-16">
                
                {/* Header */}
                <div className="bg-white border-b ">
                    <div className="mx-auto max-w-5xl px-6 py-6">
                        <Link
                            href="/jobs"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Jobs
                        </Link>

                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    {/* Company Logo */}
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                                        {job.law_firm?.logo_url ? (
                                            <img 
                                                src={job.law_firm.logo_url} 
                                                alt={`${job.law_firm.name} logo`} 
                                                className="h-14 w-14 object-cover" 
                                            />
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

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
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
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                                    {job.location && (
                                        <div className="flex items-center">
                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        {formatSalary()}
                                    </div>

                                    {job.experience_level && (
                                        <div className="flex items-center">
                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806" />
                                            </svg>
                                            {job.experience_level}
                                        </div>
                                    )}

                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                                            job.type === 'Full-time' && 'bg-green-100 text-green-800',
                                            job.type === 'Part-time' && 'bg-blue-100 text-blue-800',
                                            job.type === 'Contract' && 'bg-yellow-100 text-yellow-800',
                                            job.type === 'Internship' && 'bg-purple-100 text-purple-800',
                                        )}
                                    >
                                        {job.type}
                                    </span>

                                    {!job.is_active && (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                                            Closed
                                        </span>
                                    )}
                                </div>

                                {/* Practice Areas */}
                                {job.practice_areas && job.practice_areas.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
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
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <span>Posted {formatDate(job.created_at)}</span>
                                    {job.closing_date && <span>Closes {formatDate(job.closing_date)}</span>}
                                    {job.applications && <span>{job.applications} applications</span>}
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div className="flex-shrink-0 ml-6">
                                {job.is_active ? (
                                    job.application_url ? (
                                        <button
                                            onClick={handleApplyClick}
                                            className="inline-flex items-center rounded-md bg-amber-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none transition-colors"
                                        >
                                            Apply Now
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-sm text-gray-600 mb-2">Contact employer directly</div>
                                            {job.law_firm?.website && (
                                                <Link
                                                    href={job.law_firm.website}
                                                    target="_blank"
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                >
                                                    Visit Website
                                                </Link>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex cursor-not-allowed items-center rounded-md bg-gray-400 px-8 py-3 text-base font-medium text-white shadow-sm"
                                    >
                                        Applications Closed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-5xl px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Job Description */}
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">{job.description}</p>
                                </div>
                            </section>

                            {/* Requirements */}
                            {job.requirements && job.requirements.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
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
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
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
                            {job.is_active && (
                                <div className="bg-white p-6 rounded-lg border">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Apply?</h3>
                                    {job.application_url ? (
                                        <button
                                            onClick={handleApplyClick}
                                            className="w-full inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none transition-colors"
                                        >
                                            Apply Now
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-4">Contact the employer directly to apply for this position.</p>
                                            {job.law_firm?.website && (
                                                <Link
                                                    href={job.law_firm.website}
                                                    target="_blank"
                                                    className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                >
                                                    Visit Website
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Job Details */}
                            <div className="bg-white p-6 rounded-lg border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                                <dl className="space-y-3">
                                    {job.location && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="text-sm text-gray-900">{job.location}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                                        <dd className="text-sm text-gray-900">{job.type}</dd>
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
                                <div className="bg-white p-6 rounded-lg border">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.law_firm.name}</h3>
                                    {job.law_firm.description ? (
                                        <p className="text-sm text-gray-700 mb-4">{job.law_firm.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 mb-4">No company description available.</p>
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