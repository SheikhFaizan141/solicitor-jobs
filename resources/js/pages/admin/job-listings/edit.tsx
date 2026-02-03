import { JobListingForm } from '@/components/admin/forms/job-listing-form';
import AdminLayout from '@/layouts/admin-layout';
import { LawFirm } from '@/types/law-firms';
import { Location } from '@/types/locations';
import { router, useForm } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';

type JobListing = {
    id: number;
    title: string;
    law_firm_id: number | null;
    location_id: number | null;
    workplace_type: string;
    employment_type: string;
    experience_level: string | null;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    closing_date: string | null;
    is_active: boolean;
    description: string | null;
    excerpt: string | null;
    external_link: string | null;
    requirements: string[] | null;
    benefits: string[] | null;
    practice_areas: Array<{ id: number; name: string }>;
};

type PracticeArea = {
    id: number;
    name: string;
    parent_id: number | null;
    children?: PracticeArea[];
};

// type Location = {
//     id: number;
//     name: string;
//     region: string | null;
//     country: string;
//     is_remote: boolean;
// };

interface EditJobListingProps {
    job: JobListing;
    firms: LawFirm[];
    practiceAreas: PracticeArea[];
    locations: Location[];
}

const EditJobListing = ({ job, firms, practiceAreas, locations }: EditJobListingProps) => {
    const heartbeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        title: job.title,
        law_firm_id: job.law_firm_id?.toString() || '',
        location_id: job.location_id?.toString() || '',
        workplace_type: job.workplace_type,
        employment_type: job.employment_type,
        experience_level: job.experience_level || '',
        salary_min: job.salary_min?.toString() || '',
        salary_max: job.salary_max?.toString() || '',
        salary_currency: job.salary_currency,
        closing_date: job.closing_date || '',
        is_active: job.is_active,
        description: job.description || '',
        excerpt: job.excerpt || '',
        external_link: job.external_link || '',
        requirements: job.requirements || [''],
        benefits: job.benefits || [''],
        practice_areas: job.practice_areas.map((pa) => pa.id),
    });

    // Heartbeat to keep the lock alive
    useEffect(() => {
        const refreshLock = async () => {
            try {
                await fetch(`/admin/job-listings/${job.id}/refresh-lock`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
            } catch (error) {
                console.error('Failed to refresh lock:', error);
            }
        };

        // Refresh lock every 5 minutes (well before the 15 minute expiry)
        heartbeatInterval.current = setInterval(refreshLock, 5 * 60 * 1000);

        // Release lock when leaving the page
        const releaseLock = () => {
            // Use sendBeacon for reliable delivery on page unload
            navigator.sendBeacon(
                `/admin/job-listings/${job.id}/release-lock`,
                new Blob([JSON.stringify({ _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') })], {
                    type: 'application/json',
                }),
            );
        };

        // Handle page visibility changes (e.g., tab switching)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshLock();
            }
        };

        // Handle Inertia navigation (SPA navigation away)
        const removeInertiaListener = router.on('before', (event) => {
            // Only release lock if navigating away from this edit page
            const targetUrl = event.detail.visit.url.pathname;
            if (!targetUrl.includes(`/admin/job-listings/${job.id}/edit`)) {
                releaseLock();
            }
        });

        window.addEventListener('beforeunload', releaseLock);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
            window.removeEventListener('beforeunload', releaseLock);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            removeInertiaListener();
        };
    }, [job.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/job-listings/${job.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Job Listing</h1>
                <p className="mt-2 text-base text-gray-600">Update job listing details</p>
            </header>

            <JobListingForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                firms={firms}
                practiceAreas={practiceAreas}
                locations={locations}
                onSubmit={handleSubmit}
                submitLabel="Update Job Listing"
            />
        </div>
    );
};

EditJobListing.layout = (page: React.ReactNode) => {
    const { job } = (page as React.ReactElement<{ job: { id: number; title: string } }>).props;

    return (
        <AdminLayout
            breadcrumbs={[
                { label: 'Job Listings', href: '/admin/job-listings' },
                { label: job?.title ?? 'Job', href: job?.id ? `/admin/job-listings/${job.id}` : undefined },
                { label: 'Edit' },
            ]}
        >
            {page}
        </AdminLayout>
    );
};

export default EditJobListing;
