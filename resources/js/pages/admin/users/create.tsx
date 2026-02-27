import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    roles: string[];
}

const CreateUserPage = ({ roles }: Props) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'editor',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <div className="mx-auto max-w-lg space-y-6 bg-white px-6 py-6">
            <h1 className="text-xl font-semibold">Create User</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Name</label>
                    <input className="w-full rounded border px-3 py-2" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full rounded border px-3 py-2"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full rounded border px-3 py-2"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Role</label>
                    <select className="w-full rounded border px-3 py-2" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                        {roles
                            .filter((r) => r !== 'admin')
                            .map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <button disabled={processing} className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                        Create
                    </button>
                    <Link href="/admin/users" className="text-sm text-neutral-600 hover:underline">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

CreateUserPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateUserPage;
