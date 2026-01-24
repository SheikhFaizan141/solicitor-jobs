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
import { Contact } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface CreateLawFirmProps {
    practiceAreas: PracticeArea[];
}

const CreateFirm = ({ practiceAreas }: CreateLawFirmProps) => {
    console.log('p', practiceAreas);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        website: '',
        practice_areas: [] as number[], // IDs of selected practice areas
        // multiple contact info
        contacts: [
            {
                label: '',
                address: '',
                email: '',
                phone: '',
            },
        ] as Contact[],
        logo: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    // Build tree
    const tree = React.useMemo(() => buildPracticeAreaTree(practiceAreas), [practiceAreas]);

    console.log(tree);

    const toggleArea = (id: number) => {
        setData('practice_areas', data.practice_areas.includes(id) ? data.practice_areas.filter((x) => x !== id) : [...data.practice_areas, id]);
    };

    // Contact helpers
    const addContact = () => {
        const next = [...(data.contacts ?? []), { label: '', address: '', email: '', phone: '' }];
        setData('contacts', next);
    };
    const removeContact = (index: number) => {
        const next = (data.contacts ?? []).filter((_: Contact, i: number) => i !== index);
        setData('contacts', next);
    };
    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        const contacts = (data.contacts ?? []) as Contact[];
        const updated = contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        setData('contacts', updated);
    };

    // Preview and file input ref
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);

        // Create/revoke preview URL
        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
    };

    const handleRemoveLogo = () => {
        setData('logo', null);
        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/law-firms', {
            onSuccess: () => {
                // Clean up preview URL and reset form
                setLogoPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
                reset();
            },
            preserveScroll: true,
            forceFormData: true, // ensure multipart/form-data
        });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <header>
                <h1 className="text-2xl font-bold">Create Law Firm</h1>
                <p className="mt-2">This is the page to create a new law firm listing.</p>
            </header>

            <Card className="mt-6 px-6 py-5">
                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>

                        <div>
                            <Label htmlFor="name">Firm Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter firm name"
                                className="mt-1"
                            />
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

                        <div>
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

                            {logoPreview && (
                                <div className="mt-3 flex items-center gap-3">
                                    <img src={logoPreview} alt="Logo preview" className="h-24 w-24 rounded border bg-gray-50 object-contain" />
                                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo}>
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contacts */}
                    <ContactDetails
                        contacts={(data.contacts ?? [])}
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Firm'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

CreateFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateFirm;
