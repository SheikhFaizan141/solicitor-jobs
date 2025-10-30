import Layout from '@/layouts/main-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Search, MapPin, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Job {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    employment_type: string;
    salary_min: number | null;
    salary_max: number | null;
    created_at: string;
    law_firm: {
        id: number;
        name: string;
        slug: string;
        logo_url: string | null;
    } | null;
    practice_areas: Array<{
        id: number;
        name: string;
    }>;
}

interface PracticeArea {
    id: number;
    name: string;
}

interface HomePageProps {
    featuredJobs: Job[];
    searchResults: {
        data: Job[];
        links: any;
        meta: any;
    } | null;
    filters: {
        q?: string;
        location?: string;
        practice_area?: string;
    };
    filterOptions: {
        locations: string[];
        practiceAreas: PracticeArea[];
    };
    totalJobs: number;
}

export default function JobsHome() {
    const { featuredJobs, searchResults, filters, filterOptions, totalJobs } = usePage<any>().props as HomePageProps;
    
    const { data, setData, get, processing } = useForm({
        q: filters.q || '',
        location: filters.location || '',
        practice_area: filters.practice_area || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/home', { preserveState: true, replace: true });
    };

    // const formatSalary = (job: Job) => {
    //     if (job.salary_min && job.salary_max) {
    //         return `£${job.salary_min.toLocaleString()} - £${job.salary_max.toLocaleString()}`;
    //     }
    //     if (job.salary_min) {
    //         return `£${job.salary_min.toLocaleString()}+`;
    //     }
    //     return 'Competitive';
    // };

    // const formatEmploymentType = (type: string) => {
    //     return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    // };

    // const formatTimeAgo = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const now = new Date();
    //     const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
    //     if (diffInHours < 24) {
    //         return `${diffInHours}h ago`;
    //     } else {
    //         const diffInDays = Math.floor(diffInHours / 24);
    //         return `${diffInDays}d ago`;
    //     }
    // };

    const clearFilters = () => {
        setData({ q: '', location: '', practice_area: '' });
        get('/home', { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Legal Jobs - Find Your Perfect Legal Career" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-blue-900 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Find Your Perfect Legal Career
                            </h1>
                            <p className="mt-4 text-xl text-blue-100">
                                Discover {totalJobs.toLocaleString()}+ opportunities at top law firms across the UK
                            </p>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="mt-10 max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Job title, keywords, or company"
                                            value={data.q}
                                            onChange={(e) => setData('q', e.target.value)}
                                            className="pl-10 h-12 bg-white border-0 text-gray-900"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="pl-10 h-12 bg-white border-0 text-gray-900"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="h-12 bg-amber-600 hover:bg-amber-700"
                                >
                                    Search Jobs
                                </Button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4">
                                <Select value={data.practice_area} onValueChange={(value) => setData('practice_area', value)}>
                                    <SelectTrigger className="w-48 bg-white border-0 text-gray-900">
                                        <SelectValue placeholder="Practice Area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">All Practice Areas</SelectItem>
                                        {filterOptions.practiceAreas.map((area) => (
                                            <SelectItem key={area.id} value={area.id.toString()}>
                                                {area.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {(data.q || data.location || data.practice_area) && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={clearFilters}
                                        className="bg-white text-gray-900 border-white hover:bg-gray-100"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Search Results */}
                    {searchResults && (
                        <div className="mb-12">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Search Results ({searchResults.meta.total} jobs found)
                                </h2>
                            </div>
                            
                            <div className="space-y-4">
                                {searchResults.data.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {searchResults.links && searchResults.meta.total > 10 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex space-x-1">
                                        {searchResults.links.map((link: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Featured Jobs */}
                    {!searchResults && (
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Latest Legal Jobs</h2>
                                <Link 
                                    href="/jobs" 
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View all jobs →
                                </Link>
                            </div>
                            
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {featuredJobs.map((job) => (
                                    <JobCard key={job.id} job={job} variant="card" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

interface JobCardProps {
    job: Job;
    variant?: 'list' | 'card';
}

function JobCard({ job, variant = 'list' }: JobCardProps) {
    const formatSalary = (job: Job) => {
        if (job.salary_min && job.salary_max) {
            return `£${job.salary_min.toLocaleString()} - £${job.salary_max.toLocaleString()}`;
        }
        if (job.salary_min) {
            return `£${job.salary_min.toLocaleString()}+`;
        }
        return 'Competitive';
    };

    const formatEmploymentType = (type: string) => {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    if (variant === 'card') {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {job.law_firm?.logo_url ? (
                            <img
                                src={job.law_firm.logo_url}
                                alt={`${job.law_firm.name} logo`}
                                className="h-10 w-10 rounded object-cover"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                <Building2 className="h-5 w-5 text-gray-600" />
                            </div>
                        )}
                        <div>
                            <Link
                                href={`/jobs/${job.slug}`}
                                className="font-semibold text-gray-900 hover:text-blue-600"
                            >
                                {job.title}
                            </Link>
                            {job.law_firm && (
                                <p className="text-sm text-gray-600">{job.law_firm.name}</p>
                            )}
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatTimeAgo(job.created_at)}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                    {job.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {formatEmploymentType(job.employment_type)}
                    </div>
                    <div className="font-medium text-gray-900">
                        {formatSalary(job)}
                    </div>
                </div>

                {job.practice_areas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {job.practice_areas.slice(0, 2).map((area) => (
                            <span
                                key={area.id}
                                className="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                            >
                                {area.name}
                            </span>
                        ))}
                        {job.practice_areas.length > 2 && (
                            <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                +{job.practice_areas.length - 2} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // List variant
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {job.law_firm?.logo_url ? (
                            <img
                                src={job.law_firm.logo_url}
                                alt={`${job.law_firm.name} logo`}
                                className="h-8 w-8 rounded object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                                <Building2 className="h-4 w-4 text-gray-600" />
                            </div>
                        )}
                        <div>
                            <Link
                                href={`/jobs/${job.slug}`}
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                            >
                                {job.title}
                            </Link>
                            {job.law_firm && (
                                <p className="text-sm text-gray-600">{job.law_firm.name}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {job.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {formatEmploymentType(job.employment_type)}
                        </div>
                        <div className="font-medium text-gray-900">
                            {formatSalary(job)}
                        </div>
                    </div>

                    {job.practice_areas.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            {job.practice_areas.slice(0, 3).map((area) => (
                                <span
                                    key={area.id}
                                    className="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                                >
                                    {area.name}
                                </span>
                            ))}
                            {job.practice_areas.length > 3 && (
                                <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                    +{job.practice_areas.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">{formatTimeAgo(job.created_at)}</span>
                </div>
            </div>
        </div>
    );
}

JobsHome.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;