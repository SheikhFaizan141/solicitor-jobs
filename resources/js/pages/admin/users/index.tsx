import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    users: { data: User[] };
    roles: string[];
}

const AdminUserPage: any = () => {
    const { props } = usePage<{ users: { data: User[] }; roles: string[] }>();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Users</h1>
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
                >
                    New User
                </Link>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="py-2">Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="w-24" />
                    </tr>
                </thead>
                <tbody>
                    {props.users.data.map((u) => (
                        <tr key={u.id} className="border-b last:border-0">
                            <td className="py-2">{u.name}</td>
                            <td>{u.email}</td>

                            <td>
                                <span
                                    className={cn(
                                        'rounded px-2 py-0.5 text-xs',
                                        u.role === 'admin'
                                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-white'
                                            : u.role === 'staff'
                                              ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-white'
                                              : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-white',
                                    )}
                                >
                                    {u.role}
                                </span>
                            </td>

                            <td>
                                <Link href={`/admin/users/${u.id}/edit`} className="text-indigo-600 hover:underline">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {props.users.data.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-6 text-center text-neutral-500">
                                No users
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

AdminUserPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminUserPage;
