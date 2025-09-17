import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface LawFirm {
    id: number;
    name: string;
    slug: string;
    description: string;
    email: string;
    location: string;
    phone: string;
    // Add other fields as necessary
}
const LawFirms = () => {
    const { lawFirms } = usePage().props;

    console.log(lawFirms);

    return (
        <div className="px-4 py-3">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Law Firms</h1>
                <Link href="/admin/law-firms/create">
                    <button className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">Add New Listing</button>
                </Link>
            </div>
            <p>Welcome to the law firms management page.</p>
            {/* <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti molestiae, quod debitis voluptates optio soluta. Quae et modi
                saepe. Sint doloribus cum amet accusamus tempore atque officiis aperiam labore voluptate necessitatibus numquam soluta, explicabo
                velit excepturi accusantium facilis illo maiores.
            </p> */}
            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border border-gray-200 bg-white">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">#</th>
                            <th className="border-b px-4 py-2">Name</th>
                            <th className="border-b px-4 py-2">Location</th>
                            <th className="border-b px-4 py-2">Contact</th>
                            <th className="border-b px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lawFirms.map((firm: LawFirm) => (
                            <TableRow key={firm.id} firm={firm} />
                        ))}
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface TableRowProps {
    firm: LawFirm;
}

function TableRow({ firm }: TableRowProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this law firm?')) {
            destroy(`/admin/law-firms/${firm.id}`, {
                method: 'delete',
                preserveScroll: true,
            });
        }
    };

    return (
        <tr>
            <td className="border-b px-4 py-2">{firm.id}</td>
            <td className="border-b px-4 py-2">{firm.name}</td>
            <td className="border-b px-4 py-2">{firm.location}</td>
            <td className="border-b px-4 py-2">{firm.phone}</td>
            <td className="border-b px-4 py-2">
                <Link href={`/admin/law-firms/${firm.id}/edit`} className="mr-3 text-blue-600 hover:underline">
                    Edit
                </Link>

                <form
                    method="post"
                    action={`/admin/law-firms/${firm.id}`}
                    onSubmit={(e) => {
                        if (!confirm('Are you sure you want to delete this law firm?')) {
                            e.preventDefault();
                        }
                    }}
                    className="inline"
                >
                    <input type="hidden" name="_method" value="delete" />

                    <Button  onClick={handleDelete} disabled={processing} className="text-red-600 hover:underline disabled:opacity-50">
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </form>
            </td>
        </tr>
    );
}

LawFirms.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default LawFirms;
