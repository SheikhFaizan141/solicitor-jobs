import UserForm, { UserFormData } from '@/components/admin/forms/user-form';
import AdminLayout from '@/layouts/admin-layout';
import { type Role, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface FormUser {
    id: number;
    name: string;
    email: string;
    role: Role;
}

interface EditUserPageProps {
    user: FormUser;
    roles: Role[];
}

const EditUserPage = ({ user, roles }: EditUserPageProps) => {
    const { auth } = usePage<SharedData>().props;
    const isSelfEdit = auth.user.id === user.id;

    const { data, setData, put, processing, errors } = useForm<UserFormData>({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <>
            <Head title="Edit User - Admin" />

            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-3">
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold">Edit User</h1>
                    <p className="text-sm text-muted-foreground">Update account details and adjust permissions when needed.</p>
                </header>

                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    roles={roles}
                    mode="edit"
                    onSubmit={submit}
                    onCancelHref="/admin/users"
                    isSelfEdit={isSelfEdit}
                />
            </div>
        </>
    );
};

EditUserPage.layout = (page: React.ReactNode) => {
    const { user } = (page as React.ReactElement<{ user: FormUser }>).props;

    return (
        <AdminLayout breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: user?.name ?? 'User' }, { label: 'Edit' }]}>{page}</AdminLayout>
    );
};

export default EditUserPage;
