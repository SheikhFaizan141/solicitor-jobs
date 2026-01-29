import FirmForm, { LawFirmFormData } from '@/components/admin/forms/firm-form';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { LawFirm } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface EditLawFirmProps {
    lawFirm: LawFirm;
    practiceAreas: PracticeArea[];
}

const EditFirm = ({ lawFirm, practiceAreas }: EditLawFirmProps) => {
    const { data, setData, post, processing, errors } = useForm<LawFirmFormData>({
        name: lawFirm.name ?? '',
        description: lawFirm.description ?? '',
        website: lawFirm.website ?? '',
        practice_areas: (lawFirm.practice_areas ?? []).map((pa: PracticeArea) => pa.id),
        contacts: lawFirm.contacts ?? [],
        logo: null,
        remove_logo: false,
        _method: 'PUT', // Vital for file uploads in Inertia during update
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/law-firms/${lawFirm.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Edit Law Firm</h1>
                <p className="mt-2 text-sm text-muted-foreground">Update this law firm's details.</p>
            </header>

            <Card className="mt-6 px-6 py-5">
                <FirmForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    practiceAreas={practiceAreas}
                    isEdit={true}
                    currentLogoUrl={lawFirm.logo_url}
                    submitLabel="Save Changes"
                />
            </Card>
        </div>
    );
};

EditFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default EditFirm;
