import InputError from '@/components/input-error';
import ContactDetails from '@/components/law-firms/contact-details';
import PracticeAreaTree from '@/components/practice-area-tree';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { buildPracticeAreaTree } from '@/lib/practice-area-tree';
import { Contact, LawFirm } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { router, useForm } from '@inertiajs/react';
import React from 'react';

interface EditLawFirmProps {
    lawFirm: LawFirm;
    practiceAreas: PracticeArea[];
}

const EditFirm = ({ lawFirm, practiceAreas }: EditLawFirmProps) => {
    const { data, setData, post, processing, errors } = useForm({
        name: lawFirm.name ?? '',
        description: lawFirm.description ?? '',
        website: lawFirm.website ?? '',
        practice_areas: (lawFirm.practice_areas ?? []).map((pa) => pa.id),
        contacts: lawFirm.contacts ?? [],
        logo: null as File | null,
        remove_logo: false,
        _method: 'PUT',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    // Build tree
    const tree = React.useMemo(() => buildPracticeAreaTree(practiceAreas), [practiceAreas]);

    const toggleArea = (id: number) => {
        setData('practice_areas', data.practice_areas.includes(id) ? data.practice_areas.filter((x) => x !== id) : [...data.practice_areas, id]);
    };

    // Contact helpers
    const addContact = () => {
        setData('contacts', [...data.contacts, { label: '', address: '', email: '', phone: '' }]);
    };
    const removeContact = (index: number) => {
        setData(
            'contacts',
            data.contacts.filter((_, i) => i !== index),
        );
    };
    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        const updated = data.contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        setData('contacts', updated);
    };

    // Logo handling
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const [currentLogo, setCurrentLogo] = React.useState<string | null>(lawFirm.logo_url ?? null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        setData('remove_logo', false);

        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
    };

    const handleRemoveNewLogo = () => {
        setData('logo', null);
        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveExistingLogo = () => {
        setCurrentLogo(null);
        setData('remove_logo', true);
        setData('logo', null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/law-firms/${lawFirm.id}`, {
            onSuccess: () => {
                setLogoPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
            },
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Edit Law Firm</h1>
                <p className="mt-2 text-sm text-muted-foreground">Update this law firm's details.</p>
            </header>

            <Card className="mt-6 px-6 py-5">
                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>

                        <div>
                            <Label htmlFor="name">Firm Name *</Label>
                            <Input id="name" name="name" value={data.name} onChange={handleChange} className="mt-1" required />
                            {errors.name && <InputError message={errors.name} className="mt-2" />}
                        </div>

                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                value={data.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="mt-1"
                            />
                            {errors.website && <InputError message={errors.website} className="mt-2" />}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <RichTextEditor
                                value={data.description}
                                onChange={(html) => setData('description', html)}
                                error={errors.description}
                                placeholder="Describe the law firm, practice areas, expertise, culture..."
                            />
                            {errors.description && <InputError message={errors.description} className="mt-2" />}
                        </div>

                        <div className="">
                            <Label htmlFor="logo">Logo</Label>
                            <Input
                                id="logo"
                                name="logo"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                                onChange={handleFileChange}
                                className="mt-1"
                                ref={fileInputRef}
                            />
                            <p className="mt-1 text-sm text-muted-foreground">Max 512KB. Accepted formats: JPG, PNG, GIF, SVG</p>
                            {errors.logo && <InputError message={errors.logo} className="mt-2" />}

                            {/* Show current logo if present and no new preview */}
                            {currentLogo && !logoPreview && (
                                <div className="mt-3 flex items-center gap-3">
                                    <img src={currentLogo} alt="Current logo" className="h-24 w-24 rounded border bg-gray-50 object-contain" />
                                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveExistingLogo}>
                                        Remove
                                    </Button>
                                </div>
                            )}

                            {/* Show new preview if present */}
                            {logoPreview && (
                                <div className="mt-3 flex items-center gap-3">
                                    <img src={logoPreview} alt="New logo preview" className="h-24 w-24 rounded border bg-gray-50 object-contain" />
                                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveNewLogo}>
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contacts */}
                    <ContactDetails
                        contacts={data.contacts}
                        onChange={handleContactChange}
                        addContact={addContact}
                        removeContact={removeContact}
                        errors={errors}
                    />

                    {/* Practice Areas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Practice Areas</h3>
                        <div className="max-h-64 overflow-y-auto rounded-md border p-4">
                            {tree.length ? (
                                <PracticeAreaTree nodes={tree} selected={data.practice_areas} onToggle={toggleArea} />
                            ) : (
                                <p className="text-sm text-gray-500">No practice areas yet.</p>
                            )}
                        </div>
                        {errors.practice_areas && <InputError message={errors.practice_areas} className="mt-2" />}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => router.visit('/admin/law-firms')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Law Firm'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

EditFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default EditFirm;
