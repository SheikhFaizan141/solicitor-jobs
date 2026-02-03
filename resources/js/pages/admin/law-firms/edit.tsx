import FirmForm, { LawFirmFormData } from '@/components/admin/forms/firm-form';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { LawFirm } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { router, useForm } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';

interface EditLawFirmProps {
    lawFirm: LawFirm;
    practiceAreas: PracticeArea[];
}

const EditFirm = ({ lawFirm, practiceAreas }: EditLawFirmProps) => {
    const heartbeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const { data, setData, post, processing, errors } = useForm<LawFirmFormData>({
        name: lawFirm.name ?? '',
        description: lawFirm.description ?? '',
        website: lawFirm.website ?? '',
        practice_areas: (lawFirm.practice_areas ?? []).map((pa: PracticeArea) => pa.id),
        contacts: lawFirm.contacts ?? [],
        logo: null,
        remove_logo: false,
        _method: 'PUT', // Vital for file uploads in Inertia during update
    });

    // Heartbeat to keep the lock alive
    useEffect(() => {
        const refreshLock = async () => {
            try {
                await fetch(`/admin/law-firms/${lawFirm.id}/refresh-lock`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
            } catch (error) {
                console.error('Failed to refresh lock:', error);
            }
        };

        // Refresh lock every 5 minutes (well before the 15 minute expiry)
        heartbeatInterval.current = setInterval(refreshLock, 5 * 60 * 1000);

        // Release lock when leaving the page
        const releaseLock = () => {
            // Use sendBeacon for reliable delivery on page unload
            navigator.sendBeacon(
                `/admin/law-firms/${lawFirm.id}/release-lock`,
                new Blob([JSON.stringify({ _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') })], {
                    type: 'application/json',
                }),
            );
        };

        // Handle page visibility changes (e.g., tab switching)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshLock();
            }
        };

        // Handle Inertia navigation (SPA navigation away)
        const removeInertiaListener = router.on('before', (event) => {
            // Only release lock if navigating away from this edit page
            const targetUrl = event.detail.visit.url.pathname;
            if (!targetUrl.includes(`/admin/law-firms/${lawFirm.id}/edit`)) {
                releaseLock();
            }
        });

        window.addEventListener('beforeunload', releaseLock);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
            window.removeEventListener('beforeunload', releaseLock);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            removeInertiaListener();
        };
    }, [lawFirm.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/law-firms/${lawFirm.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Edit Law Firm</h1>
                <p className="mt-2 text-sm text-muted-foreground">Update this law firm's details.</p>
            </header>

            <Card className="mt-6 px-6 py-5">
                <FirmForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    practiceAreas={practiceAreas}
                    isEdit={true}
                    currentLogoUrl={lawFirm.logo_url}
                    submitLabel="Save Changes"
                />
            </Card>
        </div>
    );
};

EditFirm.layout = (page: React.ReactNode) => {
    const { lawFirm } = (page as React.ReactElement<{ lawFirm: { id: number; name: string } }>).props;

    return (
        <AdminLayout
            breadcrumbs={[
                { label: 'Law Firms', href: '/admin/law-firms' },
                { label: lawFirm?.name ?? 'Law Firm', href: lawFirm?.id ? `/admin/law-firms/${lawFirm.id}` : undefined },
                { label: 'Edit' },
            ]}
        >
            {page}
        </AdminLayout>
    );
};

export default EditFirm;
