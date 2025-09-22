import Layout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function JobShow() {
    const { auth } = usePage<SharedData>().props;
    const [activeTab, setActiveTab] = React.useState<'description' | 'requirements' | 'benefits'>('description');

    // Dummy job data
    const job = {
        id: 1,
        title: 'Senior Corporate Lawyer',
        lawFirm: {
            id: 1,
            name: 'Smith & Associates Law Firm',
            slug: 'smith-associates',
            logo_url: null,
        },
        location: 'London, UK',
        type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Internship',
        salary: '£80,000 - £120,000',
        experience: '5+ years',
        practiceAreas: ['Corporate Law', 'M&A', 'Securities', 'Financial Services'],
        description: `We are seeking an experienced Senior Corporate Lawyer to join our prestigious law firm in the heart of London. This is an exceptional opportunity for a skilled legal professional to work on high-profile corporate transactions and provide strategic legal advice to our blue-chip clients.

The successful candidate will be responsible for handling complex mergers and acquisitions, corporate restructuring, securities offerings, and general corporate governance matters. You will work closely with our partners and collaborate with teams across multiple practice areas to deliver comprehensive legal solutions.

Our firm has a long-standing reputation for excellence in corporate law, representing FTSE 100 companies, multinational corporations, and emerging growth companies. We pride ourselves on delivering innovative legal strategies and maintaining the highest standards of client service.

This role offers significant opportunities for professional development, including mentoring junior associates, leading client presentations, and building lasting relationships with key stakeholders in the corporate community.`,
        requirements: [
            'Qualified solicitor with 5+ years of corporate law experience',
            'Strong academic background with LLB/JD from a top-tier law school',
            'Extensive experience in M&A transactions and corporate finance',
            'Knowledge of UK corporate law, securities regulations, and compliance',
            'Experience with international transactions and cross-border deals',
            'Excellent drafting and negotiation skills',
            'Strong analytical and problem-solving abilities',
            'Ability to work under pressure and manage multiple deadlines',
            'Outstanding communication and client relationship skills',
            'Proficiency in legal research and document management systems',
            'Business development experience preferred',
            'Fluency in additional languages is an advantage'
        ],
        benefits: [
            'Competitive salary with performance-based bonuses',
            'Comprehensive health and dental insurance',
            'Life insurance and disability coverage',
            'Generous pension scheme with firm contributions',
            '25 days annual leave plus bank holidays',
            'Flexible working arrangements and remote work options',
            'Professional development budget for training and conferences',
            'Sabbatical opportunities for long-term employees',
            'Season ticket loans and cycle-to-work scheme',
            'On-site gym and wellness programs',
            'Regular firm social events and networking opportunities',
            'Access to client entertainment and hospitality events',
            'Mentorship programs and career progression planning',
            'Technology allowance for home office setup'
        ],
        postedDate: '2024-09-20',
        closingDate: '2024-10-20',
        applications: 47,
        isActive: true,
    };

    const { data, setData, processing, errors } = useForm({
        coverLetter: '',
        resume: null as File | null,
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.user) {
            window.location.href = '/login';
            return;
        }

        // Simulate application submission
        alert('Application submitted successfully!');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title={`${job.title} at ${job.lawFirm.name}`} />
            <article className="mx-auto my-8 w-full max-w-7xl px-4">
                {/* Header Section */}
                <header className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <Link 
                            href="/jobs" 
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Jobs
                        </Link>

                        {!job.isActive && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Closed
                            </span>
                        )}
                    </div>

                    <div className="flex items-start gap-6">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                            {job.lawFirm.logo_url ? (
                                <img src={job.lawFirm.logo_url} alt={`${job.lawFirm.name} logo`} className="h-14 w-14 object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-600">
                                    {job.lawFirm.name
                                        .split(' ')
                                        .map((w: string) => w[0])
                                        .join('')
                                        .slice(0, 2)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">{job.title}</h1>
                            <Link 
                                href={`/law-firms/${job.lawFirm.slug}`}
                                className="text-xl font-medium text-amber-600 hover:text-amber-700 hover:underline"
                            >
                                {job.lawFirm.name}
                            </Link>

                            {/* Job Meta Info */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    {job.salary}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    {job.experience}
                                </div>
                                <div className="flex items-center">
                                    <span className={cn(
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                        job.type === 'Full-time' && 'bg-green-100 text-green-800',
                                        job.type === 'Part-time' && 'bg-blue-100 text-blue-800',
                                        job.type === 'Contract' && 'bg-yellow-100 text-yellow-800',
                                        job.type === 'Internship' && 'bg-purple-100 text-purple-800'
                                    )}>
                                        {job.type}
                                    </span>
                                </div>
                            </div>

                            {/* Practice Areas */}
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {job.practiceAreas.map(area => (
                                        <span key={area} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex-shrink-0">
                            {job.isActive ? (
                                auth.user ? (
                                    <button
                                        onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    >
                                        Apply Now
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    >
                                        Login to Apply
                                    </Link>
                                )
                            ) : (
                                <button
                                    disabled
                                    className="inline-flex items-center rounded-md bg-gray-400 px-6 py-3 text-sm font-medium text-white shadow-sm cursor-not-allowed"
                                >
                                    Applications Closed
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Job Stats */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
                        <div className="flex items-center gap-6">
                            <span>Posted {formatDate(job.postedDate)}</span>
                            {job.closingDate && (
                                <span>Closes {formatDate(job.closingDate)}</span>
                            )}
                        </div>
                        <span>{job.applications} applications</span>
                    </div>
                </header>

                {/* Content Tabs */}
                <section className="rounded-lg border bg-white shadow-sm">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={cn(
                                    'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                    activeTab === 'description'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                Job Description
                            </button>
                            <button
                                onClick={() => setActiveTab('requirements')}
                                className={cn(
                                    'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                    activeTab === 'requirements'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                Requirements
                            </button>
                            <button
                                onClick={() => setActiveTab('benefits')}
                                className={cn(
                                    'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                    activeTab === 'benefits'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                Benefits
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        <div className={cn(activeTab !== 'description' && 'hidden')}>
                            <div className="prose prose-sm max-w-none text-gray-700">
                                <p className="whitespace-pre-line">{job.description}</p>
                            </div>
                        </div>

                        <div className={cn(activeTab !== 'requirements' && 'hidden')}>
                            <ul className="space-y-3">
                                {job.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <svg className="mt-1 h-4 w-4 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={cn(activeTab !== 'benefits' && 'hidden')}>
                            <ul className="space-y-3">
                                {job.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <svg className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Application Form */}
                {job.isActive && auth.user && (
                    <section id="application-form" className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900">Apply for this Position</h2>
                        
                        <form onSubmit={handleApply} className="space-y-6">
                            <div>
                                <label htmlFor="coverLetter" className="mb-3 block text-sm font-medium text-gray-700">
                                    Cover Letter *
                                </label>
                                <textarea
                                    id="coverLetter"
                                    rows={6}
                                    className="block w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                    value={data.coverLetter}
                                    onChange={(e) => setData('coverLetter', e.target.value)}
                                    required
                                />
                                {errors.coverLetter && (
                                    <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="resume" className="mb-3 block text-sm font-medium text-gray-700">
                                    Resume/CV *
                                </label>
                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    onChange={(e) => setData('resume', e.target.files?.[0] || null)}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                                </p>
                                {errors.resume && (
                                    <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-gray-600">
                                    <p>By applying, you agree to our Terms of Service and Privacy Policy.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center rounded-md bg-amber-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                )}

                {/* Call to Action for Non-Authenticated Users */}
                {job.isActive && !auth.user && (
                    <section className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">Ready to Apply?</h3>
                        <p className="mb-6 text-gray-600">Create an account or log in to apply for this position</p>
                        <div className="flex justify-center gap-4">
                            <Link 
                                href="/login" 
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                Log In
                            </Link>
                            <Link 
                                href="/register" 
                                className="inline-flex items-center rounded-md bg-amber-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                            >
                                Create Account
                            </Link>
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}

JobShow.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;