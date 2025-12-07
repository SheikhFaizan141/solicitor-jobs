import { JobListingForm } from '@/components/admin/forms/job-listing-form';
import AdminLayout from '@/layouts/admin-layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

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

const CreateJobListing = () => {
    const { firms, practiceAreas, locations } = usePage().props as {
        firms: LawFirm[];
        practiceAreas: PracticeArea[];
        locations: Location[];
    };

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        law_firm_id: '',
        location_id: '',
        workplace_type: 'onsite',
        employment_type: 'full_time',
        experience_level: '',
        salary_min: '',
        salary_max: '',
        salary_currency: 'GBP',
        closing_date: '',
        is_active: true,
        description: '',
        requirements: [''],
        benefits: [''],
        practice_areas: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/job-listings', {
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Job Listing</h1>
                <p className="mt-2 text-base text-gray-600">Add a new job listing to the platform</p>
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
                submitLabel="Create Job Listing"
            />
        </div>
    );
};

CreateJobListing.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateJobListing;