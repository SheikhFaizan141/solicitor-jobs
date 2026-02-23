import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type ApplicationStatus, type UserJobInteraction } from '@/types/job-interactions';
import { PaginatedResponse } from '@/types/types';
import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, MapPin, Send, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applied Jobs',
        href: '/applied-jobs',
    },
];

interface AppliedJobsPageProps {
    appliedJobs: PaginatedResponse<UserJobInteraction>;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
    applied: { label: 'Applied', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    interview: { label: 'Interview', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    offer: { label: 'Offer', className: 'bg-green-50 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
    withdrawn: { label: 'Withdrawn', className: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function AppliedJobsIndex({ appliedJobs }: AppliedJobsPageProps) {
    const handleRemove = (interactionId: number) => {
        router.delete(`/applied-jobs/${interactionId}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Applied Jobs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
                        <p className="mt-2 text-gray-600">
                            {appliedJobs.total} {appliedJobs.total === 1 ? 'application' : 'applications'} tracked
                        </p>
                    </div>

                    {appliedJobs.data.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                            <Send className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No applications tracked yet</h3>
                            <p className="mt-2 text-gray-500">
                                When you click <strong>Apply Now</strong> on a job, it will appear here automatically.
                            </p>
                            <Link href="/jobs">
                                <Button className="mt-6">Browse Jobs</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appliedJobs.data.map((interaction) => (
                                <AppliedJobCard key={interaction.id} interaction={interaction} onRemove={handleRemove} />
                            ))}
                        </div>
                    )}

                    {appliedJobs.links && appliedJobs.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-1">
                                {appliedJobs.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url || '#'}
                                        className={cn(
                                            'rounded border px-3 py-2 text-sm',
                                            link.active
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
                                            !link.url && 'pointer-events-none opacity-50',
                                        )}
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

function AppliedJobCard({ interaction, onRemove }: { interaction: UserJobInteraction; onRemove: (id: number) => void }) {
    const job = interaction.job_listing;
    const currentStatus = (interaction.metadata?.application_status ?? 'applied') as ApplicationStatus;
    const config = statusConfig[currentStatus];

    const appliedAt = interaction.metadata?.applied_at
        ? new Date(interaction.metadata.applied_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : new Date(interaction.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });

    const handleStatusChange = (value: string) => {
        router.patch(
            `/applied-jobs/${interaction.id}/status`,
            { application_status: value },
            { preserveScroll: true },
        );
    };

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3">
                        <Link href={`/jobs/${job.slug}`} className="text-xl font-semibold text-gray-900 hover:text-amber-600">
                            {job.title}
                        </Link>
                        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', config.className)}>
                            {config.label}
                        </span>
                    </div>

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
                        <span className="text-gray-400">Applied {appliedAt}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={currentStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger className="h-8 w-[140px] text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(interaction.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

AppliedJobsIndex.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
