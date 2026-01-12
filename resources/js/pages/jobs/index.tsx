import { CreateJobAlertDialog } from '@/components/job-alerts/create-job-alert-dialog';
import { JobFiltersSidebar } from '@/components/jobs/job-filters-sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/layouts/main-layout';
import { JobListingWithRelations } from '@/types/job-listing';
import { Location } from '@/types/locations';
import { PracticeArea } from '@/types/practice-area';
import { PaginatedResponse } from '@/types/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

type Job = JobListingWithRelations;

interface AppliedFilters {
    q?: string;
    location_id?: string;
    practice_area_id?: string;
    type?: string;
    experience: string;
}

interface JobsPageProps {
    jobs: PaginatedResponse<Job>;
    filters: {
        locations: Location[];
        employment_types: string[];
        experience_levels: string[];
        practiceAreas: PracticeArea[];
    };
    filterOptions: {
        locations: Location[];
        employment_types: string[];
        practice_areas: PracticeArea[];
    };
    appliedFilters: AppliedFilters;
}

// interface JobsIndexProps {}

export default function JobsIndex({ jobs, filters, filterOptions, appliedFilters }: JobsPageProps) {
    const [searchTerm, setSearchTerm] = useState(appliedFilters.q || '');
    const [selectedLocationId, setSelectedLocationId] = useState(appliedFilters.location_id || '');
    const [selectedPracticeAreaId, setSelectedPracticeAreaId] = useState(appliedFilters.practice_area_id || '');
    const [selectedType, setSelectedType] = useState(appliedFilters.type || '');
    const [selectedExperience, setSelectedExperience] = useState(appliedFilters.experience || '');

    // Sync state when URL changes (e.g., pagination, back button)
    useEffect(() => {
        setSearchTerm(appliedFilters.q || '');
        setSelectedLocationId(appliedFilters.location_id || '');
        setSelectedPracticeAreaId(appliedFilters.practice_area_id || '');
        setSelectedType(appliedFilters.type || '');
        setSelectedExperience(appliedFilters.experience || '');
    }, [appliedFilters]);

    const handleFilterChange = () => {
        const params: Record<string, string> = {};

        if (searchTerm) params.q = searchTerm;
        if (selectedLocationId) params.location_id = selectedLocationId;
        if (selectedPracticeAreaId) params.practice_area_id = selectedPracticeAreaId;
        if (selectedType) params.type = selectedType;
        if (selectedExperience) params.experience = selectedExperience;

        router.get('/jobs', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        handleFilterChange();
    };

    const hasActiveFilters = !!(searchTerm || selectedLocationId || selectedPracticeAreaId || selectedType || selectedExperience);

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedLocationId('');
        setSelectedPracticeAreaId('');
        setSelectedType('');
        setSelectedExperience('');

        router.get(
            '/jobs',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Legal Jobs" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find Your Perfect Legal Career</h1>
                            <p className="mt-4 text-xl text-gray-600">Discover opportunities at top law firms across the UK</p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Filters Sidebar */}
                        <JobFiltersSidebar
                            searchTerm={searchTerm}
                            selectedLocationId={selectedLocationId}
                            selectedPracticeAreaId={selectedPracticeAreaId}
                            selectedType={selectedType}
                            selectedExperience={selectedExperience}
                            hasActiveFilters={hasActiveFilters}
                            filters={filters}
                            onSearchChange={setSearchTerm}
                            onLocationChange={setSelectedLocationId}
                            onPracticeAreaChange={setSelectedPracticeAreaId}
                            onTypeChange={setSelectedType}
                            onExperienceChange={setSelectedExperience}
                            onApplyFilters={handleSearch}
                            onClearFilters={clearAllFilters}
                        />

                        {/* Job Listings */}
                        <div className="lg:w-3/4">
                            {/* Results Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {jobs.total} {jobs.total === 1 ? 'Job' : 'Jobs'} Found
                                </h2>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="apple">Most Recent</SelectItem>
                                        <SelectItem value="banana">Salary: High to Low</SelectItem>
                                        <SelectItem value="blueberry">Salary: Low to High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Job Cards */}
                            <div className="space-y-6">
                                {jobs.data.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>

                            {/* No Results */}
                            {jobs.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters to find more results.</p>

                                    {/* Job Alert CTA */}
                                    {hasActiveFilters && (
                                        <div className="mt-6">
                                            <p className="mb-3 text-sm text-gray-600">Don't want to miss out?</p>
                                            <CreateJobAlertDialog
                                                filterOptions={filterOptions}
                                                prefilledFilters={{
                                                    locationId: selectedLocationId,
                                                    practiceAreaId: selectedPracticeAreaId,
                                                    employmentType: selectedType,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {jobs.links && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex space-x-1">
                                        {jobs.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url ? link.url : '#'}
                                                className={`rounded border px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'border-blue-500 bg-blue-500 text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface JobCardProps {
    job: JobListingWithRelations;
}

function JobCard({ job }: JobCardProps) {
    const formatSalary = (job: Job) => {
        if (!job.salary_min && !job.salary_max) return 'Salary not disclosed';

        const currency = job.salary_currency === 'GBP' ? '£' : job.salary_currency;

        if (job.salary_min && job.salary_max) {
            return `${currency}${job.salary_min.toLocaleString()} - ${currency}${job.salary_max.toLocaleString()}`;
        } else if (job.salary_min) {
            return `${currency}${job.salary_min.toLocaleString()}+`;
        } else {
            return `Up to ${currency}${job.salary_max?.toLocaleString()}`;
        }
    };

    const formatEmploymentType = (type: string) => {
        return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatPostedDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return '1 week ago';
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    return (
        <div key={job.id} className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                        <Link href={`/jobs/${job.slug}`} className="cursor-pointer text-xl font-semibold text-gray-900 hover:text-amber-600">
                            {job.title}
                        </Link>
                        {job.law_firm && (
                            <Link href={`/law-firms/${job.law_firm.slug}`} className="mt-1 block text-lg font-medium text-amber-600 hover:underline">
                                {job.law_firm.name}
                            </Link>
                        )}
                        {!job.law_firm && <p className="mt-1 text-lg font-medium text-gray-600">Independent Posting</p>}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            {formatEmploymentType(job.employment_type)}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">{formatPostedDate(job.created_at)}</p>
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {job.location && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location.name}
                        </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                        </svg>
                        {formatSalary(job)}
                    </div>
                    {job.experience_level && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>
                            {job.experience_level}
                        </div>
                    )}
                </div>

                {/* Practice Areas */}
                {job.practice_areas.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {job.practice_areas.map((area) => (
                                <span
                                    key={area.id}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                                >
                                    {area.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                {job.excerpt && <p className="mb-4 line-clamp-2 text-gray-600">{job.excerpt}</p>}

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {job.is_active ? 'Active' : 'Closed'}
                        </span>
                    </div>
                    <div className="flex space-x-3">
                        <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                            Save Job
                        </button>
                        <Link
                            href={`/jobs/${job.slug}`}
                            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

JobsIndex.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;
