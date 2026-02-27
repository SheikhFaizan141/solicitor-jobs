import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';

type PracticeArea = { id: number; name: string; parent_id: number | null };

interface EditProps {
    practiceArea: PracticeArea;
    parents: PracticeArea[];
}

const Edit = ({ practiceArea, parents }: EditProps) => {
    const { data, setData, put, processing, errors } = useForm({
        name: practiceArea.name,
        parent_id: practiceArea.parent_id ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/practice-areas/${practiceArea.id}`);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <h1 className="text-2xl font-bold">Edit Practice Area</h1>

            <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input className="w-full rounded border px-3 py-2" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Parent (optional)</label>
                <select
                    className="w-full rounded border px-3 py-2"
                    value={data.parent_id}
                    onChange={(e) => setData('parent_id', e.target.value || '')}
                >
                    <option value="">— None —</option>
                    {parents.map((p) => (
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
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Updating...' : 'Update'}
                </button>
                <Link href="/admin/practice-areas" className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                    Back
                </Link>
            </div>
        </form>
    );
};

Edit.layout = (p: React.ReactNode) => <AdminLayout>{p}</AdminLayout>;

export default Edit;
