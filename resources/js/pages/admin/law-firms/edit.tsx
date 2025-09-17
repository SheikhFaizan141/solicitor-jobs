import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface LawFirm {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    email: string;
    location: string;
    phone: string;
}

const EditFirm = () => {
    const { lawFirm } = usePage().props as { lawFirm: LawFirm };

    const { data, setData, put, processing, errors, wasSuccessful, recentlySuccessful } = useForm({
        name: lawFirm.name ?? '',
        slug: lawFirm.slug ?? '',
        description: lawFirm.description ?? '',
        email: lawFirm.email ?? '',
        location: lawFirm.location ?? '',
        phone: lawFirm.phone ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/law-firms/${lawFirm.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-xl px-4 py-3">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Edit Law Firm</h1>
                <p className="mt-2 text-sm text-muted-foreground">Update this law firm’s details.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Firm Name</Label>
                    <Input id="name" name="name" value={data.name} onChange={handleChange} required />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <Label htmlFor="slug">Slug (optional)</Label>
                    <Input id="slug" name="slug" value={data.slug} onChange={handleChange} placeholder="Leave blank to keep existing" />
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        rows={6}
                        className="resize-vertical"
                        placeholder="Firm description..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={data.email} onChange={handleChange} required />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={data.location} onChange={handleChange} required />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={data.phone} onChange={handleChange} required />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {recentlySuccessful && !processing && <span className="text-sm text-green-600">Saved</span>}
                </div>
            </form>
        </div>
    );
};

EditFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default EditFirm;
