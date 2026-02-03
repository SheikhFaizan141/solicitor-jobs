import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import React from 'react';

interface LockedJobListingProps {
    job: {
        id: number;
        title: string;
        slug: string;
    };
    lockedBy: {
        name: string;
        email: string;
    };
    lockedAt: string;
}

const LockedJobListing: React.FC<LockedJobListingProps> = ({ job, lockedBy, lockedAt }) => {
    const lockedTime = new Date(lockedAt);
    const formattedTime = lockedTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleRetry = () => {
        // Attempt to access the edit page again
        router.visit(`/admin/job-listings/${job.id}/edit`);
    };

    return (
        <>
            <Head title={`Locked - ${job.title}`} />

            <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-12">
                <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                    </div>

                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Job Listing Currently Being Edited</h1>

                    <p className="mb-6 text-gray-600">
                        <span className="font-medium text-gray-900">{lockedBy.name}</span> ({lockedBy.email}) is currently
                        editing this job listing.
                    </p>

                    <div className="mb-6 rounded-md bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Job Listing</p>
                        <p className="text-lg font-semibold text-gray-900">{job.title}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Editing started at <span className="font-medium">{formattedTime}</span>
                        </p>
                    </div>

                    <p className="mb-6 text-sm text-gray-500">
                        The lock will automatically expire after 15 minutes of inactivity. Please try again later or contact{' '}
                        {lockedBy.name} to coordinate.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button variant="outline" onClick={handleRetry} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>

                        <Link href="/admin/job-listings">
                            <Button variant="default" className="w-full gap-2 sm:w-auto">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Job Listings
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

LockedJobListing.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default LockedJobListing;
