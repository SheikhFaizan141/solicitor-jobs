import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { UserJobInteraction } from '@/types/job-interactions';
import { PaginatedResponse } from '@/types/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Bookmark, Briefcase, MapPin, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saved Jobs',
        href: '/saved-jobs',
    },
];

interface SavedJobsPageProps {
    savedJobs: PaginatedResponse<UserJobInteraction>;
}

export default function SavedJobsIndex({ savedJobs }: SavedJobsPageProps) {
    const { auth } = usePage<SharedData>().props;

    if (!auth.user) {
        return null;
    }

    const handleUnsave = (jobId: number) => {
        router.delete(`/jobs/${jobId}/unsave`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Saved Jobs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                        <p className="mt-2 text-gray-600">
                            {savedJobs.total} {savedJobs.total === 1 ? 'job' : 'jobs'} saved
                        </p>
                    </div>

                    {savedJobs.data.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                            <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No saved jobs yet</h3>
                            <p className="mt-2 text-gray-500">Start saving jobs to keep them here for later.</p>
                            <Link href="/jobs">
                                <Button className="mt-6">Browse Jobs</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savedJobs.data.map((interaction) => (
                                <SavedJobCard key={interaction.id} interaction={interaction} onUnsave={handleUnsave} />
                            ))}
                        </div>
                    )}

                    {savedJobs.links && savedJobs.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-1">
                                {savedJobs.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded border px-3 py-2 text-sm ${
                                            link.active
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function SavedJobCard({ interaction, onUnsave }: { interaction: UserJobInteraction; onUnsave: (jobId: number) => void }) {
    const job = interaction.job_listing;
    const { data, setData, patch, processing } = useForm({ notes: interaction.notes || '' });

    const handleSaveNotes = () => {
        patch(`/saved-jobs/${interaction.id}/notes`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <Link href={`/jobs/${job.slug}`} className="text-xl font-semibold text-gray-900 hover:text-amber-600">
                        {job.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.law_firm?.name || 'Independent'}
                        </div>
                        {job.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location.name}
                            </div>
                        )}
                    </div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => onUnsave(job.id)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                    value={data.notes}
                    onChange={(event) => {
                        setData('notes', event.target.value);
                    }}
                    className="mt-2"
                    rows={3}
                    placeholder="Add a note to remember why you saved this job..."
                />
                <div className="mt-2 flex justify-end">
                    <Button type="button" size="sm" variant="outline" onClick={handleSaveNotes} disabled={processing}>
                        Save note
                    </Button>
                </div>
            </div>
        </div>
    );
}

SavedJobsIndex.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
