import { CreateJobAlertDialog } from '@/components/job-alerts/create-job-alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Location } from '@/types/locations';
import { PracticeArea } from '@/types/practice-area';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, Briefcase, Building2, Plus, TrendingUp } from 'lucide-react';

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
    recentAlerts?: Array<{
        id: number;
        frequency: string;
        location: string | null;
        employment_types: string[];
        practice_area_count: number;
        matchCount: number;
    }>;
    filterOptions?: {
        locations: Location[];
        practice_areas: PracticeArea[];
        employment_types: string[];
    };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { isAdmin, stats, adminStats, recentAlerts, filterOptions } = usePage<DashboardProps>().props;

    if (isAdmin) {
        return <AdminDashboard stats={adminStats} />;
    }

    return <UserDashboard stats={stats} recentAlerts={recentAlerts} filterOptions={filterOptions} />;
}

function UserDashboard({ stats, recentAlerts, filterOptions }: Pick<DashboardProps, 'stats' | 'recentAlerts' | 'filterOptions'>) {
    const hasAlerts = recentAlerts && recentAlerts.length > 0;

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
                <div className="grid gap-4 md:grid-cols-4">
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
                            <p className="text-xs text-muted-foreground">Ready to apply</p>
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

                    <Card className="bg-blue-50 dark:bg-blue-950/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {filterOptions && (
                                <CreateJobAlertDialog
                                    filterOptions={filterOptions}
                                    triggerButton={
                                        <Button size="sm" className="w-full">
                                            <Plus className="mr-2 h-4 w-4" />
                                            New Alert
                                        </Button>
                                    }
                                />
                            )}
                            <Button size="sm" variant="outline" className="w-full" asChild>
                                <Link href="/jobs">Browse Jobs</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Alerts Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Your Job Alerts</CardTitle>
                                <CardDescription>Get notified when jobs matching your criteria are posted</CardDescription>
                            </div>
                            {hasAlerts && (
                                <Button asChild variant="outline">
                                    <Link href="/job-alerts">Manage All</Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {hasAlerts ? (
                            <div className="space-y-3">
                                {recentAlerts!.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                <Bell className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium capitalize">{alert.frequency} Digest</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span>{alert.location || 'All locations'}</span>
                                                    {alert.employment_types && alert.employment_types.length > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{alert.employment_types.length} job types</span>
                                                        </>
                                                    )}
                                                    {alert.practice_area_count > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{alert.practice_area_count} practice areas</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-blue-600">
                                                {alert.matchCount} new {alert.matchCount === 1 ? 'match' : 'matches'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <Button asChild variant="ghost" className="w-full">
                                    <Link href="/job-alerts">View all alerts →</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                    <Bell className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No job alerts yet</h3>
                                <p className="mt-2 max-w-sm text-sm text-gray-600">
                                    Create your first alert to get notified about relevant opportunities matching your criteria
                                </p>
                                {filterOptions && (
                                    <CreateJobAlertDialog
                                        filterOptions={filterOptions}
                                        triggerButton={
                                            <Button className="mt-4">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Your First Alert
                                            </Button>
                                        }
                                    />
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Placeholder sections for future features */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Recent Job Matches
                            </CardTitle>
                            <CardDescription>Jobs that match your alerts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="relative p-8 text-center text-sm text-gray-500">Coming soon...</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Recommended Jobs
                            </CardTitle>
                            <CardDescription>Personalized job recommendations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="relative p-8 text-center text-sm text-gray-500">Coming soon...</div>
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
