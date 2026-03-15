import UserForm, { UserFormData } from '@/components/admin/forms/user-form';
import AdminLayout from '@/layouts/admin-layout';
import { type Role } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface CreateUserPageProps {
    roles: Role[];
}

const CreateUserPage = ({ roles }: CreateUserPageProps) => {
    const defaultRole = roles.includes('editor') ? 'editor' : roles[0] || 'user';

    const { data, setData, post, processing, errors } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: defaultRole,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <>
            <Head title="Create User - Admin" />

            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-3">
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold">Create User</h1>
                    <p className="text-sm text-muted-foreground">Add a new account and assign role permissions for the admin workspace.</p>
                </header>

                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    roles={roles}
                    mode="create"
                    onSubmit={submit}
                    onCancelHref="/admin/users"
                />
            </div>
        </>
    );
};

CreateUserPage.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: 'Create' }]}>{page}</AdminLayout>
);

export default CreateUserPage;
