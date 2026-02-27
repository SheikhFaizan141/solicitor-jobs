import { Button } from '@/components/ui/button';
import { forceDelete, restore } from '@/routes/admin/reviews';
import { mark } from '@/routes/admin/reviews/spam';
import { move } from '@/routes/admin/reviews/trash';
import { Review } from '@/types/review';
import { useForm } from '@inertiajs/react';

interface ReviewActionsProps {
    review: Review;
    activeTab: 'active' | 'spam' | 'trash';
}

export default function ReviewActions({ review, activeTab }: ReviewActionsProps) {
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
