import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import React from 'react';

const CreateFirm = () => {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        email: '',
        location: '',
        phone: '',
        contact: '',
        logo: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
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
        <div className="mx-auto w-full max-w-xl px-4 py-3">
            <header>
                <h1 className="text-2xl font-bold">Create Law Firm</h1>
                <p className="mt-2">This is the page to create a new law firm listing.</p>
            </header>

            <div className="mt-6">
                <form className="max-w-md space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <Label htmlFor="name">Firm Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={handleChange} required placeholder="Enter firm name" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    {/* Slug omitted: server auto-generates */}
                    <div>
                        <Label htmlFor="description">Firm Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Enter firm description, practice areas, job opportunities..."
                            rows={6}
                            className="resize-vertical"
                        />
                        <p className="mt-1 text-sm text-muted-foreground">You can use basic formatting. Line breaks will be preserved.</p>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email address"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={data.location} onChange={handleChange} required placeholder="Enter location" />
                        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={data.phone} onChange={handleChange} required placeholder="Enter phone number" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Optional future field: contact info */}
                    {/* <div>
                        <Label htmlFor="contact">Contact Info</Label>
                        <Input id="contact" name="contact" value={data.contact} onChange={handleChange} placeholder="Enter contact info" />
                        {errors.contact && <p className=\"mt-1 text-sm text-red-600\">{errors.contact}</p>}
                    </div> */}

                    {/* Optional file upload */}
                    <div>
                        <Label htmlFor="logo">Firm Logo</Label>
                        <Input id="logo" name="logo" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                        {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}

                        {logoPreview && (
                            <div className="mt-3 flex items-center gap-3">
                                <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded border object-cover" />
                                <Button type="button" variant="secondary" onClick={handleRemoveLogo}>
                                    Remove logo
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Firm'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

CreateFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateFirm;
