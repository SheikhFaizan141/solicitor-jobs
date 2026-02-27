import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { Role, User } from '@/types';
import { PaginatedResponse } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React from 'react';

interface AdminUserPageProps {
    users: PaginatedResponse<User>;
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
}

const AdminUserPage = ({ users, roles, filters }: AdminUserPageProps) => {
    const {
        data,
        setData,
        get,
        processing,
        delete: destroy, // add destroy helper
    } = useForm({
        search: filters.search || '',
        role: filters.role || '',
    });

    const handleFilter = () => {
        get('/admin/users', {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setData({ search: '', role: '' });

        router.get('/admin/users', {
            data: { search: '', role: '' },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter();
    };

    const getRoleBadgeClasses = (role: string) => {
        return cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            role === 'admin' ? 'bg-purple-100 text-purple-800' : role === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800',
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Users Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Users Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage user accounts and permissions</p>
                    </div>
                    <Link href="/admin/users/create" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Add New User
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium">Filters</h3>
                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <Label htmlFor="search">Search Users</Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Role Filter */}
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select value={data.role || 'all'} onValueChange={(value) => setData('role', value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All roles</SelectItem>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-end gap-2">
                                <Button type="submit" disabled={processing}>
                                    Apply Filters
                                </Button>
                                <Button type="button" variant="outline" onClick={handleClear} disabled={processing}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-600">
                        Showing {users.data.length} of {users.total} users
                        {(data.search || data.role) && (
                            <span className="ml-1">
                                (filtered{data.search && ` by "${data.search}"`}
                                {data.role && ` • role: ${data.role}`})
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-600">
                        Page {users.current_page} of {users.last_page}
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="border-b text-left">
                                    <th className="px-6 py-3 font-medium text-gray-900">Name</th>
                                    <th className="px-6 py-3 font-medium text-gray-900">Email</th>
                                    <th className="px-6 py-3 font-medium text-gray-900">Role</th>
                                    <th className="px-6 py-3 font-medium text-gray-900">Created</th>
                                    <th className="px-6 py-3 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => {
                                    const handleDelete = () => {
                                        if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
                                        destroy(`/admin/users/${user.id}`, {
                                            preserveScroll: true,
                                        });
                                    };
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={getRoleBadgeClasses(user.role)}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{formatDate(user.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={handleDelete}
                                                    disabled={processing}
                                                    className="ml-3 text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                {data.search || data.role ? (
                                                    <>
                                                        <p className="text-sm">No users found matching your filters.</p>
                                                        <Button variant="link" onClick={handleClear} className="mt-2 text-blue-600">
                                                            Clear filters
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <p className="text-sm">No users found.</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-1">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={cn(
                                        'rounded px-3 py-2 text-sm',
                                        link.active ? 'bg-blue-600 text-white' : 'border bg-white text-gray-700 hover:bg-gray-100',
                                        !link.url && 'cursor-not-allowed opacity-50',
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

AdminUserPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminUserPage;
