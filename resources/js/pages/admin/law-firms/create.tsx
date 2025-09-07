import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import React, { useState } from 'react';

const CreateFirm = () => {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        email: '',
        location: '',
        phone: '',
        contact: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // handle form submission here
    };
    return (
        <div className="px-4 py-3">
            <header>
                <h1 className="text-2xl font-bold">Create Law Firm</h1>
                <p className="mt-2">This is the page to create a new law firm listing.</p>
                {/* Add your form or content here */}
            </header>

            <div className="mt-6">
                <form className="max-w-md space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="name">Firm Name</Label>
                        <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={form.location} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="contact">Contact Info</Label>
                        <Input id="contact" name="contact" value={form.contact} onChange={handleChange} required />
                    </div>
                    <Button type="submit">Create Firm</Button>
                </form>
            </div>
        </div>
    );
};

CreateFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateFirm;
