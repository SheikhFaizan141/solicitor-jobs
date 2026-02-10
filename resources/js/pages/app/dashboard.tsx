import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, Briefcase, Building2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    isAdmin: boolean;
    stats?: {
        activeAlerts: number;
        savedJobs: number;
        applications: number;
        newMatches: number;
    };
    adminStats?: {
        totalJobs: number;
        activeJobs: number;
        totalUsers: number;
        totalFirms: number;
    };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { isAdmin, stats, adminStats } = usePage<DashboardProps>().props;

    if (isAdmin) {
        return <AdminDashboard stats={adminStats} />;
    }

    return <UserDashboard stats={stats} />;
}

function UserDashboard({ stats }: Pick<DashboardProps, 'stats'>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                    <p className="mt-2 text-gray-600">Manage your job search from your personalized dashboard</p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.activeAlerts || 0}</div>
                            <p className="text-xs text-muted-foreground">{stats?.newMatches || 0} new matches today</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.savedJobs || 0}</div>
                            <p className="text-xs text-muted-foreground">Shortlist for later</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Applications</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.applications || 0}</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Saved Jobs</CardTitle>
                            <CardDescription>Keep track of roles you want to revisit</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-semibold text-gray-900">{stats?.savedJobs || 0}</p>
                                    <p className="text-sm text-muted-foreground">jobs saved</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/saved-jobs">Open list</Link>
                                </Button>
                            </div>
                            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                Use Saved Jobs to organize your shortlist and add notes for follow-ups.
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Job Alerts</CardTitle>
                            <CardDescription>Get notified about roles that match you</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-semibold text-gray-900">{stats?.activeAlerts || 0}</p>
                                    <p className="text-sm text-muted-foreground">active alerts</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/job-alerts">Manage alerts</Link>
                                </Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                <span>{stats?.newMatches || 0} new matches today</span>
                                <Bell className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}

function AdminDashboard({ stats }: { stats?: DashboardProps['adminStats'] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Overview of platform metrics</p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                            <p className="text-xs text-muted-foreground">{stats?.activeJobs || 0} active</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-muted-foreground">Registered job seekers</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Law Firms</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalFirms || 0}</div>
                            <p className="text-xs text-muted-foreground">Total firms</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 dark:bg-blue-950/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button size="sm" className="w-full" asChild>
                                <Link href="/admin/job-listings">Manage Jobs</Link>
                            </Button>
                            <Button size="sm" variant="outline" className="w-full" asChild>
                                <Link href="/admin/law-firms">Manage Firms</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
