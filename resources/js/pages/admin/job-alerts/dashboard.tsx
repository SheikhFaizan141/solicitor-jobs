import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Bell, Mail, MousePointerClick, Users } from 'lucide-react';
import React from 'react';

interface Stats {
    total_active: number;
    total_inactive: number;
    daily_alerts: number;
    weekly_alerts: number;
    total_sent: number;
    total_clicks: number;
    avg_click_rate: number;
    ctr_top_3: number;
    ctr_rest: number;
    apply_rate_from_alerts: number;
    personalized_vs_baseline_lift: number;
    trend_last_30_days: Array<{
        date: string;
        delivered: number;
        clicked: number;
        applied: number;
        ctr: number;
    }>;
}

interface Props {
    stats: Stats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <>
            <Head title="Job Alerts Dashboard - Admin" />

            <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Job Alerts Dashboard</h1>
                        <p className="mt-2 text-muted-foreground">Smart Alert performance and engagement insights</p>
                    </div>
                    <Link
                        href="/admin/job-alerts/subscriptions"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Manage Subscriptions
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_active}</div>
                            <p className="text-xs text-muted-foreground">{stats.total_inactive} inactive</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Frequency Split</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.daily_alerts} / {stats.weekly_alerts}
                            </div>
                            <p className="text-xs text-muted-foreground">Daily / Weekly</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_sent.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{stats.total_clicks.toLocaleString()} clicks</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avg_click_rate}%</div>
                            <p className="text-xs text-muted-foreground">Across all alerts</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CTR Top 3</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ctr_top_3}%</div>
                            <p className="text-xs text-muted-foreground">Last 30 days</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CTR Rest</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ctr_rest}%</div>
                            <p className="text-xs text-muted-foreground">Rank 4+</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Apply Rate</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.apply_rate_from_alerts}%</div>
                            <p className="text-xs text-muted-foreground">From delivered jobs</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Personalization Lift</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.personalized_vs_baseline_lift}%</div>
                            <p className="text-xs text-muted-foreground">CTR vs baseline</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>30-Day Engagement Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {stats.trend_last_30_days.slice(-7).map((day) => (
                            <div key={day.date} className="flex items-center justify-between text-sm">
                                <span>{new Date(day.date).toLocaleDateString()}</span>
                                <span className="text-muted-foreground">
                                    Delivered {day.delivered} | Clicked {day.clicked} | Applied {day.applied} | CTR {day.ctr}%
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
