import { LocationFormDialog } from '@/components/admin/location-form-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { Location } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LocationsIndexProps {
    locations: {
        data: Location[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const LocationsIndex: React.FC<LocationsIndexProps> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({ locations }) => {
    const { delete: destroy, processing: deleteProcessing } = useForm();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    console.log(locations);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/admin/locations', { search: search, sort_by: sortBy }, { preserveState: true, preserveScroll: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, sortBy]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete location "${name}"? This cannot be undone.`)) {
            destroy(`/admin/locations/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`Location "${name}" deleted successfully.`);
                },
            });
        }
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setIsEditOpen(true);
    };

    const getPaginationInfo = () => {
        const start = (locations.current_page - 1) * locations.per_page + 1;
        const end = Math.min(locations.current_page * locations.per_page, locations.total);
        return `Showing ${start}-${end} of ${locations.total} locations`;
    };

    return (
        <>
            <Head title="Locations Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage job locations and their associated listings</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="text-white">
                                <PlusIcon className="mr-2 h-8 w-8" />
                                Add New Location
                            </Button>
                        </DialogTrigger>
                        <LocationFormDialog mode="create" onClose={() => setIsCreateOpen(false)} />
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="rounded-md border bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search bar */}
                        <div className="relative flex-1">
                            <label htmlFor="location-search" className="sr-only">
                                Search locations
                            </label>
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="location-search"
                                type="search"
                                placeholder="Search locations…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white/80 py-2.5 pr-10 pl-10 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center rounded-md p-1 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2 sm:ml-4">
                            <span className="hidden text-xs text-gray-500 sm:inline">Sort</span>
                            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                                <SelectTrigger className="w-[190px] rounded-lg border-gray-200 text-sm shadow-sm focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name A–Z</SelectItem>
                                    <SelectItem value="-name">Name Z–A</SelectItem>
                                    <SelectItem value="-created_at">Newest</SelectItem>
                                    <SelectItem value="created_at">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Compact summary strip */}
                    <div className="border-t px-3 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                            <div
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-2.5 py-1',
                                    locations.total ? 'bg-gray-100' : 'bg-amber-50 text-amber-700',
                                )}
                            >
                                {locations.total > 0 ? getPaginationInfo() : 'No locations found'}
                            </div>
                            {locations.last_page > 1 && (
                                <div className="text-gray-500">
                                    Page {locations.current_page} of {locations.last_page}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Job Listings</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Created</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {locations.data.map((location) => (
                                    <tr key={location.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{location.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{location.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {location.job_listings_count} {location.job_listings_count === 1 ? 'job' : 'jobs'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(location.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <div className="flex justify-end space-x-2">
                                                <Dialog
                                                    open={isEditOpen && editingLocation?.id === location.id}
                                                    onOpenChange={(open) => {
                                                        setIsEditOpen(open);
                                                        if (!open) setEditingLocation(null);
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <button
                                                            onClick={() => handleEdit(location)}
                                                            className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-900"
                                                        >
                                                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                    </DialogTrigger>
                                                    {editingLocation && (
                                                        <LocationFormDialog
                                                            mode="edit"
                                                            location={editingLocation}
                                                            onClose={() => {
                                                                setIsEditOpen(false);
                                                                setEditingLocation(null);
                                                            }}
                                                        />
                                                    )}
                                                </Dialog>
                                                <button
                                                    onClick={() => handleDelete(location.id, location.name)}
                                                    disabled={deleteProcessing}
                                                    className="inline-flex items-center text-red-600 transition-colors hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {locations.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                {search ? (
                                                    <>
                                                        <p className="text-sm">No locations found matching your search.</p>
                                                        <button onClick={() => setSearch('')} className="mt-2 text-sm text-blue-600 hover:underline">
                                                            Clear search
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                        </svg>
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No locations</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new location.</p>
                                                        <div className="mt-6">
                                                            <Button onClick={() => setIsCreateOpen(true)}>
                                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M12 4v16m8-8H4"
                                                                    />
                                                                </svg>
                                                                Add Location
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {locations.last_page > 1 && (
                        <div className="border-t border-gray-200 bg-white px-6 py-3">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-gray-700">{getPaginationInfo()}</div>

                                <nav className="flex items-center space-x-2">
                                    {locations.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveState={true}
                                            preserveScroll={true}
                                            className={cn(
                                                'rounded-md px-3 py-1 text-sm font-medium',
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                      ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                      : 'cursor-not-allowed text-gray-300',
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

LocationsIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default LocationsIndex;
