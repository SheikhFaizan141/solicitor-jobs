import { useForm } from '@inertiajs/react';

import React from 'react';
import { Button } from '../ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Location } from '@/types/locations';

interface LocationFormDialogProps {
    mode: 'create' | 'edit';
    location?: Location;
    onClose: () => void;
}

export function LocationFormDialog({ mode, location, onClose }: LocationFormDialogProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: location?.name || '',
        slug: location?.slug || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post('/admin/locations', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else if (mode === 'edit' && location) {
            put(`/admin/locations/${location.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create Location' : 'Edit Location'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create' ? 'Add a new job location to the system' : 'Update location information'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Location Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. London, Manchester, Remote UK"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        <p className="text-sm text-muted-foreground">The display name for this location</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (Optional)</Label>
                        <Input id="slug" name="slug" value={data.slug} onChange={handleChange} placeholder="e.g. london, manchester, remote-uk" />
                        {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                        <p className="text-sm text-muted-foreground">Leave blank to auto-generate from name. Used in URLs.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create Location' : 'Update Location'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
