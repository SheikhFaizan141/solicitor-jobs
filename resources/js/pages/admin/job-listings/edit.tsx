import { JobListingForm } from '@/components/admin/forms/job-listing-form';
import AdminLayout from '@/layouts/admin-layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

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
    requirements: string[] | null;
    benefits: string[] | null;
    practice_areas: Array<{ id: number; name: string }>;
};

type LawFirm = {
    id: number;
    name: string;
};

type PracticeArea = {
    id: number;
    name: string;
    parent_id: number | null;
    children?: PracticeArea[];
};

type Location = {
    id: number;
    name: string;
    region: string | null;
    country: string;
    is_remote: boolean;
};

const EditJobListing = () => {
    const { job, firms, practiceAreas, locations } = usePage().props as {
        job: JobListing;
        firms: LawFirm[];
        practiceAreas: PracticeArea[];
        locations: Location[];
    };

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
        requirements: job.requirements || [''],
        benefits: job.benefits || [''],
        practice_areas: job.practice_areas.map((pa) => pa.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/job-listings/${job.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
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

EditJobListing.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default EditJobListing;
