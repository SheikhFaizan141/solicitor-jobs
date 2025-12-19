import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { queryParams } from '@/wayfinder';
import { Bell, Search, Trash2, ToggleLeft, ToggleRight, TrendingUp, Users, Mail, MousePointerClick } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Location {
    id: number;
    name: string;
    region: string | null;
    country: string;
}

interface PracticeArea {
    id: number;
    name: string;
}

interface JobAlertSubscription {
    id: number;
    user: User;
    frequency: 'daily' | 'weekly';
    employment_types: string[];
    location: Location | null;
    practice_areas: PracticeArea[];
    is_active: boolean;
    last_sent_at: string | null;
    sent_count: number;
    click_count: number;
    failed_count: number;
    clicks_count: number;
    created_at: string;
}

interface PaginatedSubscriptions {
    data: JobAlertSubscription[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total_active: number;
    total_inactive: number;
    daily_alerts: number;
    weekly_alerts: number;
    total_sent: number;
    total_clicks: number;
    avg_click_rate: number;
}

interface Filters {
    search?: string;
    frequency?: string;
    is_active?: string;
    location_id?: string;
    practice_area_id?: string;
    sort_by?: string;
    sort_order?: string;
}

interface Props {
    subscriptions: PaginatedSubscriptions;
    stats: Stats;
    filters: Filters;
    locations: Location[];
    practiceAreas: PracticeArea[];
}

export default function Index({ subscriptions, stats, filters, locations, practiceAreas }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/admin/job-alerts' + queryParams({ query: { ...filters, search, page: 1 } }), {}, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        if (!value || value === 'all') {
            delete newFilters[key];
        }
        router.get('/admin/job-alerts' + queryParams({ query: newFilters }), {}, { preserveState: true });
    };

    const handleSort = (sortBy: string) => {
        const sortOrder = filters.sort_by === sortBy && filters.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(
            '/admin/job-alerts' + queryParams({ query: { ...filters, sort_by: sortBy, sort_order: sortOrder } }),
            {},
            { preserveState: true }
        );
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        setSelectedIds((prev) =>
            prev.length === subscriptions.data.length ? [] : subscriptions.data.map((s) => s.id)
        );
    };

    const handleBulkToggle = (isActive: boolean) => {
        if (selectedIds.length === 0) return;

        router.post(
            '/admin/job-alerts/bulk-toggle',
            { ids: selectedIds, is_active: isActive },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} job alert(s)?`)) return;

        router.post('/admin/job-alerts/bulk-destroy', { ids: selectedIds }, {
            preserveScroll: true,
            onSuccess: () => setSelectedIds([]),
        });
    };

    const handleToggle = (id: number, isActive: boolean) => {
        router.patch(`/admin/job-alerts/${id}`, { is_active: !isActive }, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this job alert?')) return;
        router.delete(`/admin/job-alerts/${id}`, { preserveScroll: true });
    };

    const getClickRate = (subscription: JobAlertSubscription): string => {
        if (subscription.sent_count === 0) return '0%';
        return `${((subscription.click_count / subscription.sent_count) * 100).toFixed(1)}%`;
    };

    return (
        <>
            <Head title="Job Alerts - Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Job Alerts</h1>
                    <p className="text-muted-foreground mt-2">Manage user job alert subscriptions and track engagement</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_active}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_inactive} inactive
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Frequency Split</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.daily_alerts} / {stats.weekly_alerts}</div>
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
                            <p className="text-xs text-muted-foreground">
                                {stats.total_clicks.toLocaleString()} clicks
                            </p>
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
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by user name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frequency</label>
                                <Select value={filters.frequency || 'all'} onValueChange={(v) => handleFilter('frequency', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={filters.is_active || 'all'} onValueChange={(v) => handleFilter('is_active', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Select value={filters.location_id || 'all'} onValueChange={(v) => handleFilter('location_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {locations.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Practice Area</label>
                                <Select value={filters.practice_area_id || 'all'} onValueChange={(v) => handleFilter('practice_area_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Areas</SelectItem>
                                        {practiceAreas.map((area) => (
                                            <SelectItem key={area.id} value={area.id.toString()}>
                                                {area.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="flex items-center justify-between py-3">
                            <span className="text-sm font-medium">{selectedIds.length} selected</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleBulkToggle(true)}>
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                    Activate
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkToggle(false)}>
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                    Deactivate
                                </Button>
                                <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedIds.length === subscriptions.data.length && subscriptions.data.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Practice Areas</TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('sent_count')}
                                    >
                                        Sent
                                    </TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('click_count')}
                                    >
                                        Clicks
                                    </TableHead>
                                    <TableHead>CTR</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('last_sent_at')}
                                    >
                                        Last Sent
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                                            No job alerts found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscriptions.data.map((subscription) => (
                                        <TableRow key={subscription.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(subscription.id)}
                                                    onCheckedChange={() => toggleSelect(subscription.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{subscription.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {subscription.frequency}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {subscription.location ? subscription.location.name : 'All'}
                                            </TableCell>
                                            <TableCell>
                                                {subscription.practice_areas.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {subscription.practice_areas.slice(0, 2).map((area) => (
                                                            <Badge key={area.id} variant="secondary" className="text-xs">
                                                                {area.name}
                                                            </Badge>
                                                        ))}
                                                        {subscription.practice_areas.length > 2 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{subscription.practice_areas.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">All</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{subscription.sent_count}</TableCell>
                                            <TableCell>{subscription.click_count}</TableCell>
                                            <TableCell>{getClickRate(subscription)}</TableCell>
                                            <TableCell>
                                                <Badge variant={subscription.is_active ? 'default' : 'secondary'}>
                                                    {subscription.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {subscription.last_sent_at
                                                    ? new Date(subscription.last_sent_at).toLocaleDateString()
                                                    : 'Never'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleToggle(subscription.id, subscription.is_active)}
                                                    >
                                                        {subscription.is_active ? (
                                                            <ToggleLeft className="h-4 w-4" />
                                                        ) : (
                                                            <ToggleRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(subscription.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {subscriptions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {subscriptions.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;