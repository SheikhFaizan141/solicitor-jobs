import ReviewFilters from '@/components/admin/reviews/review-filters';
import ReviewStats from '@/components/admin/reviews/review-stats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { bulk, forceDelete, index, restore, spam, trash } from '@/routes/admin/reviews';
import { mark } from '@/routes/admin/reviews/spam';
import { move } from '@/routes/admin/reviews/trash';
import { LawFirm } from '@/types/law-firms';
import { Review, ReviewStatus } from '@/types/review';
import { PaginatedResponse } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface ReviewsIndexProps {
    reviews: PaginatedResponse<Review>;
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

export default function ReviewsIndex({ reviews, activeTab, filters, lawFirms, stats }: ReviewsIndexProps) {
    const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const handleBulkAction = (action: string) => {
        if (selectedReviews.length === 0) return;

        if (action === 'delete' && !confirm('Permanently delete selected reviews? This cannot be undone.')) {
            return;
        }

        router.post(
            bulk.url(),
            {
                action: action,
                reviews: selectedReviews,
            },
            {
                onStart: () => setBulkProcessing(true),
                onFinish: () => setBulkProcessing(false),
                onSuccess: () => {
                    setSelectedReviews([]);
                },
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const toggleReviewSelection = (reviewId: number) => {
        setSelectedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]));
    };

    const toggleSelectAll = () => {
        setSelectedReviews(selectedReviews.length === reviews.data.length ? [] : reviews.data.map((review) => review.id));
    };

    const getStatusBadge = (status: ReviewStatus) => {
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

    const getPaginationInfo = () => {
        const start = (reviews.current_page - 1) * reviews.per_page + 1;
        const end = Math.min(reviews.current_page * reviews.per_page, reviews.total);
        return `Showing ${start}-${end} of ${reviews.total} results`;
    };

    return (
        <>
            <Head title="Review Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Review Management</h1>
                </div>

                {/* Stats Cards */}
                <ReviewStats active={stats.active} spam={stats.spam} trash={stats.trash} />

                {/* Review Filters */}
                {showFilters && <ReviewFilters filters={filters} lawFirms={lawFirms} activeTab={activeTab} />}

                {/* Tabs */}
                <Tabs value={activeTab} className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Tab Navigation */}
                        <TabsList>
                            <TabsTrigger value="active" asChild>
                                <Link href={index.get()} preserveState>
                                    Active ({stats.active})
                                </Link>
                            </TabsTrigger>
                            <TabsTrigger value="spam" asChild>
                                <Link href={spam.get()} preserveState>
                                    Spam ({stats.spam})
                                </Link>
                            </TabsTrigger>
                            <TabsTrigger value="trash" asChild>
                                <Link href={trash.get()} preserveState>
                                    Trash ({stats.trash})
                                </Link>
                            </TabsTrigger>
                        </TabsList>

                        {/* Filter Toggle Button */}
                        <ReviewFilters.Toggle isOpen={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                    </div>

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
                                        <TableHead className="w-12 ps-3">
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
                                    {reviews.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reviews.data.map((review) => (
                                            <TableRow key={review.id}>
                                                <TableCell className="ps-3">
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
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {reviews.links && (
                                <div className="border-t border-gray-200 bg-white px-6 pt-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-sm text-gray-700">{getPaginationInfo()}</div>

                                        <nav className="flex items-center space-x-2">
                                            {reviews.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    preserveState={true}
                                                    preserveScroll={true}
                                                    className={`rounded-md px-3 py-1 text-sm font-medium ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                              ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                              : 'cursor-not-allowed text-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
interface ReviewActionsProps {
    review: Review;
    activeTab: 'active' | 'spam' | 'trash';
}

function ReviewActions({ review, activeTab }: ReviewActionsProps) {
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
            markAsSpam: mark.url(reviewId),
            moveToTrash: move.url(reviewId),
            restore: restore.url(reviewId),
            forceDelete: forceDelete.url(reviewId),
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
