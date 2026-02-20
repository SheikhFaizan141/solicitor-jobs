import FirmForm, { LawFirmFormData } from '@/components/admin/forms/firm-form';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { create } from '@/routes/admin/law-firms';
import { Contact } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface CreateLawFirmProps {
    practiceAreas: PracticeArea[];
}

const CreateFirm = ({ practiceAreas }: CreateLawFirmProps) => {
    const { data, setData, post, processing, reset, errors } = useForm<LawFirmFormData>({
        name: '',
        description: '',
        excerpt: '',
        is_active: true,
        website: '',
        practice_areas: [] as number[], // IDs of selected practice areas
        contacts: [] as Contact[],
        logo: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(create);
        post('/admin/law-firms', {
            onSuccess: () => reset(), // Inertia handles the reset, FirmForm will re-render
            forceFormData: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <header>
                <h1 className="text-2xl font-bold">Create Law Firm</h1>
                <p className="mt-2">This is the page to create a new law firm listing.</p>
            </header>

            <Card className="mt-6 px-6 py-5">
                <FirmForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    practiceAreas={practiceAreas}
                    submitLabel="Create Firm"
                />
            </Card>
        </div>
    );
};

CreateFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateFirm;
