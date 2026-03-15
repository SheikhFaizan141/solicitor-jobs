import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function JobAlertsIndex() {
    return (
        <>
            <Head title="Job Alerts - Admin" />
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Job Alerts</h1>
                <p className="text-muted-foreground">This entry point now redirects to the Job Alerts Dashboard.</p>
                <div className="flex gap-3">
                    <Link
                        href="/admin/job-alerts/dashboard"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Open Dashboard
                    </Link>
                    <Link
                        href="/admin/job-alerts/subscriptions"
                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
                    >
                        Open Subscriptions
                    </Link>
                </div>
            </div>
        </>
    );
}

JobAlertsIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
