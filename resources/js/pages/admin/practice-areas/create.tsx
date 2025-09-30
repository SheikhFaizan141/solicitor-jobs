import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type PracticeArea = { id: number; name: string };

const Create = () => {
    const { parents } = usePage().props as { parents: PracticeArea[] };
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        parent_id: '' as string | number | '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/practice-areas');
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <h1 className="text-2xl font-bold">Add Practice Area</h1>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    className="w-full rounded border px-3 py-2"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Parent (optional)</label>
                <select
                    className="w-full rounded border px-3 py-2"
                    value={data.parent_id}
                    onChange={e => setData('parent_id', e.target.value || '')}
                >
                    <option value="">— None —</option>
                    {parents.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
                {errors.parent_id && <p className="mt-1 text-sm text-red-600">{errors.parent_id}</p>}
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save'}
                </button>
                <Link
                    href="/admin/practice-areas"
                    className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
};

Create.layout = (p: React.ReactNode) => <AdminLayout>{p}</AdminLayout>;
export default Create;