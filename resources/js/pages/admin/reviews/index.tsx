import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    status: 'active' | 'spam' | 'trashed';
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    law_firm: {
        id: number;
        name: string;
    };
}

interface LawFirm {
    id: number;
    name: string;
}

interface PageProps {
    reviews: {
        data: Review[];
        links: any[];
        meta: any;
    };
    activeTab: 'active' | 'spam' | 'trash';
    filters: {
        rating?: string;
        law_firm?: string;
        start_date?: string;
        end_date?: string;
        search?: string;
        sort?: string;
    };
    lawFirms: LawFirm[];
    stats: {
        active: number;
        spam: number;
        trash: number;
    };
}

export default function ReviewsIndex() {
    const { reviews, activeTab, filters, lawFirms, stats } = usePage<PageProps>().props;
    const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        rating: filters.rating || '',
        law_firm: filters.law_firm || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        search: filters.search || '',
        sort: filters.sort || '',
    });

    const { post: bulkAction, processing: bulkProcessing } = useForm({
        action: '',
        reviews: selectedReviews,
    });

    const handleFilter = () => {
        get(route(`admin.reviews.${activeTab}`), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBulkAction = (action: string) => {
        if (selectedReviews.length === 0) return;

        if (action === 'delete' && !confirm('Permanently delete selected reviews? This cannot be undone.')) {
            return;
        }

        bulkAction.setData({
            action,
            reviews: selectedReviews,
        });

        bulkAction.post(route('admin.reviews.bulk'), {
            onSuccess: () => {
                setSelectedReviews([]);
            },
        });
    };

    const toggleReviewSelection = (reviewId: number) => {
        setSelectedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]));
    };

    const toggleSelectAll = () => {
        setSelectedReviews(selectedReviews.length === reviews.data.length ? [] : reviews.data.map((review) => review.id));
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'default',
            spam: 'destructive',
            trashed: 'secondary',
        } as const;

        return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    return (
        <>
            <Head title="Review Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Review Management</h1>
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Spam Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.spam}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Trashed Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{stats.trash}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                                <div>
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        placeholder="Search reviews..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="rating">Rating</Label>
                                    <Select value={data.rating} onValueChange={(value) => setData('rating', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All ratings" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="22">All ratings</SelectItem>
                                            <SelectItem value="5">5 stars</SelectItem>
                                            <SelectItem value="4">4 stars</SelectItem>
                                            <SelectItem value="3">3 stars</SelectItem>
                                            <SelectItem value="2">2 stars</SelectItem>
                                            <SelectItem value="1">1 star</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="law_firm">Law Firm</Label>
                                    <Select value={data.law_firm} onValueChange={(value) => setData('law_firm', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All firms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2">All firms</SelectItem>
                                            {lawFirms.map((firm) => (
                                                <SelectItem key={firm.id} value={firm.id.toString()}>
                                                    {firm.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                </div>

                                <div>
                                    <Label htmlFor="sort">Sort By</Label>
                                    <Select value={data.sort} onValueChange={(value) => setData('sort', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Newest first" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="22">Newest first</SelectItem>
                                            <SelectItem value="oldest">Oldest first</SelectItem>
                                            <SelectItem value="rating_high">Rating: High to Low</SelectItem>
                                            <SelectItem value="rating_low">Rating: Low to High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button onClick={handleFilter} disabled={processing}>
                                    Apply Filters
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setData({
                                            rating: '',
                                            law_firm: '',
                                            start_date: '',
                                            end_date: '',
                                            search: '',
                                            sort: '',
                                        });
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="active" asChild>
                            <Link preserveState>Active ({stats.active})</Link>
                        </TabsTrigger>
                        <TabsTrigger value="spam" asChild>
                            {/* <Link href={route('admin.reviews.spam')} preserveState>
                                Spam ({stats.spam})
                            </Link> */}
                            <Link preserveState>Spam ({stats.spam})</Link>
                        </TabsTrigger>
                        <TabsTrigger value="trash" asChild>
                            {/* <Link href={route('admin.reviews.trash')} preserveState>
                                Trash ({stats.trash})
                            </Link> */}
                            <Link preserveState>Trash ({stats.trash})</Link>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-4">
                        {/* Bulk Actions */}
                        {selectedReviews.length > 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium">{selectedReviews.length} review(s) selected</span>
                                        <div className="flex gap-2">
                                            {activeTab === 'active' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('spam')}
                                                        disabled={bulkProcessing}
                                                    >
                                                        Mark as Spam
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('trash')}
                                                        disabled={bulkProcessing}
                                                    >
                                                        Move to Trash
                                                    </Button>
                                                </>
                                            )}
                                            {activeTab === 'spam' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('activate')}
                                                        disabled={bulkProcessing}
                                                    >
                                                        Mark as Active
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('trash')}
                                                        disabled={bulkProcessing}
                                                    >
                                                        Move to Trash
                                                    </Button>
                                                </>
                                            )}
                                            {activeTab === 'trash' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleBulkAction('restore')}
                                                        disabled={bulkProcessing}
                                                    >
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleBulkAction('delete')}
                                                        disabled={bulkProcessing}
                                                    >
                                                        Delete Permanently
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews Table */}
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedReviews.length === reviews.data.length && reviews.data.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Law Firm</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reviews.data.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedReviews.includes(review.id)}
                                                    onCheckedChange={() => toggleReviewSelection(review.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                    <span className="text-sm">{review.rating}/5</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <div className="truncate" title={review.comment || 'No comment'}>
                                                    {review.comment || <em className="text-gray-500">No comment</em>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{review.user.name}</div>
                                                    <div className="text-sm text-gray-500">{review.user.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    // href={route('admin.law-firms.show', review.law_firm.id)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {review.law_firm.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(review.status)}</TableCell>
                                            <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <ReviewActions review={review} activeTab={activeTab} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

// Individual Review Actions Component
function ReviewActions({ review, activeTab }: { review: Review; activeTab: string }) {
    const { post, processing } = useForm();

    const handleAction = (action: string, reviewId: number) => {
        let confirmMessage = '';

        if (action === 'forceDelete') {
            confirmMessage = 'Permanently delete this review? This cannot be undone.';
        } else if (action === 'moveToTrash') {
            confirmMessage = 'Move this review to trash?';
        } else if (action === 'markAsSpam') {
            confirmMessage = 'Mark this review as spam?';
        }

        if (confirmMessage && !confirm(confirmMessage)) {
            return;
        }

        const routes = {
            markAsSpam: route('admin.reviews.spam.mark', reviewId),
            moveToTrash: route('admin.reviews.trash.move', reviewId),
            restore: route('admin.reviews.restore', reviewId),
            forceDelete: route('admin.reviews.force-delete', reviewId),
        };

        post(routes[action as keyof typeof routes]);
    };

    return (
        <div className="flex gap-2">
            {activeTab === 'active' && (
                <>
                    <Button size="sm" variant="outline" onClick={() => handleAction('markAsSpam', review.id)} disabled={processing}>
                        Spam
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction('moveToTrash', review.id)} disabled={processing}>
                        Trash
                    </Button>
                </>
            )}

            {activeTab === 'spam' && (
                <>
                    <Button size="sm" variant="outline" onClick={() => handleAction('restore', review.id)} disabled={processing}>
                        Activate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction('moveToTrash', review.id)} disabled={processing}>
                        Trash
                    </Button>
                </>
            )}

            {activeTab === 'trash' && (
                <>
                    <Button size="sm" variant="outline" onClick={() => handleAction('restore', review.id)} disabled={processing}>
                        Restore
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction('forceDelete', review.id)} disabled={processing}>
                        Delete
                    </Button>
                </>
            )}
        </div>
    );
}

ReviewsIndex.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
