import { PublicPagination } from '@/components/pagination/public-pagination';
import { PaginatedResponse } from '@/types/types';
import { Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

export interface JobOverview {
    id: number;
    slug: string;
    title: string;
    location: string | null;
    excerpt: string | null;
    employment_type: string;
    published_at: string;
}

interface LawFirmJobsOverviewProps {
    jobs: PaginatedResponse<JobOverview>;
}

export default function LawFirmJobsTab({ jobs }: LawFirmJobsOverviewProps) {
    if (!jobs.data.length) {
        return (
            <div className="rounded-xl bg-gray-50 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10a2 2 0 002 2h4a2 2 0 002-2V8"
                    />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Jobs Available</h3>
                <p className="mt-2 text-sm text-gray-500">This law firm hasn’t posted any job openings yet.</p>
            </div>
        );
    }

    const formatEmploymentType = (type: string) => {
        return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatPostedDate = (dateString: string) => {
        console.log(dateString);

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
        <div className="space-y-8">
            <div className="space-y-6">
                {jobs.data.map((job) => (
                    <div
                        key={job.id}
                        className="flex flex-col justify-between rounded-xl border border-gray-200 p-6 transition-colors hover:border-gray-300"
                    >
                        <div className="flex flex-col justify-between">
                            <div className="flex justify-between">
                                <div className="flex-1 space-y-2.5">
                                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>

                                    <p className="text-sm text-gray-600">
                                        <MapPin className="inline-block h-4 w-4 text-gray-400" /> {job.location ?? 'Location TBC'}
                                    </p>

                                    {job.excerpt && <p className="line-clamp-2 text-sm text-gray-500">{job.excerpt}</p>}
                                </div>

                                <div className="flex flex-col items-start sm:items-end">
                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                        {formatEmploymentType(job.employment_type)}
                                    </span>
                                    <p className="mt-1 text-sm text-gray-500">{formatPostedDate(job.published_at)}</p>
                                </div>
                            </div>
                        </div>

                        <Link href={`/jobs/${job.slug}`} className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                            Apply Now
                        </Link>
                    </div>
                    // </Link>
                ))}
            </div>

            {jobs.links && jobs.total > jobs.data.length && (
                <PublicPagination links={jobs.links} currentPage={jobs.current_page} totalPages={jobs.last_page} totalResults={jobs.total} />
            )}
        </div>
    );
}
