import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Briefcase, MessageSquare, Users } from 'lucide-react';

interface DashboardStats {
    lawFirms: {
        total: number;
        active: number;
    };
    jobs: {
        total: number;
        active: number;
    };
    reviews: {
        total: number;
        pending: number;
    };
    users: {
        total: number;
        newThisMonth: number;
    };
}

const AdminDashboard = () => {
    const { stats } = usePage<{ stats: DashboardStats }>().props;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Law Firms</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lawFirms.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.lawFirms.active} active firms
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0">
                            <Link href="/admin/law-firms">View all firms →</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Job Listings</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.jobs.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.jobs.active} active listings
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0">
                            <Link href="/admin/job-listings">Manage jobs →</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.reviews.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.reviews.pending} pending review
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0">
                            <Link href="/admin/reviews">Manage reviews →</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.users.newThisMonth} new this month
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0">
                            <Link href="/admin/users">View all users →</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button asChild>
                        <Link href="/admin/law-firms/create">Add Law Firm</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/job-listings/create">Post Job</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/practice-areas/create">Add Practice Area</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

AdminDashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;