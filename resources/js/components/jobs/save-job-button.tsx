import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import React from 'react';

interface SaveJobButtonProps {
    jobId: number;
    isSaved: boolean;
    size?: 'sm' | 'default' | 'lg';
    variant?: 'outline' | 'default' | 'ghost';
    className?: string;
    iconOnly?: boolean;
}

export function SaveJobButton({
    jobId,
    isSaved,
    size = 'sm',
    variant = 'outline',
    className,
    iconOnly = false,
}: SaveJobButtonProps) {
    const { auth } = usePage<SharedData>().props;
    const [saving, setSaving] = React.useState(false);
    const [savedState, setSavedState] = React.useState(isSaved);

    React.useEffect(() => {
        setSavedState(isSaved);
    }, [isSaved]);

    const handleToggle = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setSaving(true);

        if (savedState) {
            router.delete(`/jobs/${jobId}/unsave`, {
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => setSavedState(false),
            });
        } else {
            router.post(
                `/jobs/${jobId}/save`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setSaving(false),
                    onSuccess: () => setSavedState(true),
                },
            );
        }
    };

    return (
        <Button
            type="button"
            variant={savedState ? 'default' : variant}
            size={size}
            className={['gap-2', className].filter(Boolean).join(' ')}
            onClick={handleToggle}
            disabled={saving}
        >
            <Bookmark className={['h-4 w-4', savedState ? 'fill-current' : ''].join(' ')} />
            {!iconOnly && <span>{savedState ? 'Saved' : 'Save Job'}</span>}
        </Button>
    );
}
