import Layout from '@/layouts/main-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, MapPin, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, FormEvent } from 'react';
import { Location } from '@/types/locations';
import { PracticeArea } from '@/types/practice-area';

interface Job {
    id: number;
    title: string;
    slug: string;
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
    location: {
        id: number;
        name: string;
        region: string | null;
        country: string;
        is_remote: boolean;
    } | null;
    practice_areas: Array<{
        id: number;
        name: string;
    }>;
}


interface HomePageProps {
    featuredJobs: Job[];
    filterOptions: {
        locations: Location[];
        practiceAreas: PracticeArea[];
    };
    totalJobs: number;
}

export default function Home({ featuredJobs, filterOptions, totalJobs }: HomePageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationId, setLocationId] = useState('');
    const [practiceAreaId, setPracticeAreaId] = useState('');
    
    

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        const params: Record<string, string> = {};
        
        if (searchQuery) params.q = searchQuery;
        if (locationId && locationId !== 'all') params.location_id = locationId;
        if (practiceAreaId && practiceAreaId !== 'all') params.practice_area_id = practiceAreaId;

        router.get('/jobs', params);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocationId('');
        setPracticeAreaId('');
    };

    const getLocationDisplay = (location: Location): string => {
        const parts = [location.name];
        if (location.region) parts.push(location.region);
        if (location.is_remote) parts.push('(Remote)');
        return parts.join(', ');
    };

    return (
        <>
            <Head title="Find Your Perfect Legal Career" />
            
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
                        <form onSubmit={handleSearch} className="mt-10 max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                                {/* Search Query */}
                                <div className="md:col-span-5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Job title, keywords, or company"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-12 bg-white border-0 text-gray-900"
                                        />
                                    </div>
                                </div>
                                
                                {/* Location */}
                                <div className="md:col-span-4">
                                    <Select value={locationId} onValueChange={setLocationId}>
                                        <SelectTrigger className="h-12 bg-white border-0 text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <SelectValue placeholder="Location" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            {filterOptions.locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {getLocationDisplay(location)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search Button */}
                                <div className="md:col-span-3">
                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 bg-amber-600 hover:bg-amber-700"
                                    >
                                        Search Jobs
                                    </Button>
                                </div>
                            </div>

                            {/* Practice Area Filter */}
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-blue-100" />
                                    <span className="text-sm text-blue-100">Practice Area:</span>
                                </div>
                                <Select value={practiceAreaId} onValueChange={setPracticeAreaId}>
                                    <SelectTrigger className="w-64 bg-white border-0 text-gray-900">
                                        <SelectValue placeholder="All Practice Areas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Practice Areas</SelectItem>
                                        {filterOptions.practiceAreas.map((area) => (
                                            <SelectItem key={area.id} value={area.id.toString()}>
                                                {area.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {(searchQuery || locationId || practiceAreaId) && (
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
                    {/* Featured Jobs */}
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
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface JobCardProps {
    job: Job;
}

function JobCard({ job }: JobCardProps) {
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

    const getLocationDisplay = () => {
        if (!job.location) return null;
        const parts = [job.location.name];
        if (job.location.region) parts.push(job.location.region);
        return parts.join(', ');
    };

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
                        {getLocationDisplay()}
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

Home.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;