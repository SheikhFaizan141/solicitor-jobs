import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

const CreateFirm = () => {
    const { errors } = usePage().props;
    console.log(errors);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        email: '',
        location: '',
        phone: '',
        contact: '',
        logo: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'logo' && files) {
            setForm({ ...form, logo: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Using Inertia.js for form submission
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value as string | Blob);
            }
        });

        router.post('/admin/law-firms', data, {
            forceFormData: true,
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
                        <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter firm name" />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required placeholder="Enter unique slug" />
                    </div>

                    <div>
                        <Label htmlFor="description">Firm Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Enter firm description, practice areas, job opportunities..."
                            rows={6}
                            className="resize-vertical"
                        />
                        <p className="mt-1 text-sm text-muted-foreground">You can use basic formatting. Line breaks will be preserved.</p>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email address"
                        />
                    </div>
                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={form.location} onChange={handleChange} required placeholder="Enter location" />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="Enter phone number" />
                    </div>

                    {/* <div>
                        <Label htmlFor="contact">Contact Info</Label>
                        <Input id="contact" name="contact" value={form.contact} onChange={handleChange} required placeholder="Enter contact info" />
                    </div>
                     */}

                    {/* <div>
                        <Label htmlFor="logo">Firm Logo</Label>
                        <Input id="logo" name="logo" type="file" accept="image/*" onChange={handleChange} placeholder="Upload firm logo" />
                    </div> */}

                    <Button type="submit">Create Firm</Button>
                </form>
            </div>
        </div>
    );
};

CreateFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateFirm;
