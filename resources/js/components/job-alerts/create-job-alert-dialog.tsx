import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import React, { useState } from 'react';

interface Location {
    id: number;
    name: string;
    region: string | null;
    country: string;
    is_remote: boolean;
}

interface PracticeArea {
    id: number;
    name: string;
}

interface FilterOptions {
    locations: Location[];
    practice_areas?: PracticeArea[];
    practiceAreas?: PracticeArea[];
    employment_types: string[];
}

interface CreateJobAlertDialogProps {
    filterOptions: FilterOptions;
    prefilledFilters?: {
        locationId?: string;
        practiceAreaId?: string;
        employmentType?: string;
    };
    triggerButton?: React.ReactNode;
}

export function CreateJobAlertDialog({ filterOptions, prefilledFilters, triggerButton }: CreateJobAlertDialogProps) {
    const [open, setOpen] = useState(false);
    
    // Extract filter options with fallbacks
    const locations = filterOptions.locations || [];
    const practiceAreas = filterOptions.practiceAreas || filterOptions.practice_areas || [];
    const employmentTypes = filterOptions.employment_types || ['full_time', 'part_time', 'contract', 'internship'];

    const { data, setData, post, processing, errors, reset } = useForm({
        frequency: 'daily' as 'daily' | 'weekly',
        employment_types: prefilledFilters?.employmentType ? [prefilledFilters.employmentType] : ([] as string[]),
        practice_area_ids: prefilledFilters?.practiceAreaId ? [parseInt(prefilledFilters.practiceAreaId)] : ([] as number[]),
        location_id: prefilledFilters?.locationId ? parseInt(prefilledFilters.locationId) : (null as number | null),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/job-alerts', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const toggleEmploymentType = (type: string) => {
        const current = new Set(data.employment_types);
        if (current.has(type)) {
            current.delete(type);
        } else {
            current.add(type);
        }
        setData('employment_types', Array.from(current));
    };

    const togglePracticeArea = (id: number) => {
        const current = new Set(data.practice_area_ids);
        if (current.has(id)) {
            current.delete(id);
        } else {
            current.add(id);
        }
        setData('practice_area_ids', Array.from(current));
    };

    const getLocationDisplay = (location: Location): string => {
        const parts = [location.name];
        if (location.region) parts.push(location.region);
        if (location.is_remote) parts.push('(Remote)');
        return parts.join(', ');
    };

    const formatEmploymentType = (type: string): string => {
        return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button variant="outline">
                        <Bell className="mr-2 h-4 w-4" />
                        Create Job Alert
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Job Alert</DialogTitle>
                        <DialogDescription>
                            Get notified when new jobs matching your criteria are posted. We'll send you a digest of matching opportunities.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        {/* Frequency */}
                        <div className="space-y-2">
                            <Label>How often would you like to receive alerts?</Label>
                            <div className="flex gap-4">
                                {(['daily', 'weekly'] as const).map((freq) => (
                                    <label key={freq} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="frequency"
                                            value={freq}
                                            checked={data.frequency === freq}
                                            onChange={() => setData('frequency', freq)}
                                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm capitalize">{freq}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.frequency && <p className="text-sm text-red-600">{errors.frequency}</p>}
                        </div>

                        {/* Employment Types */}
                        <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <div className="flex flex-wrap gap-2">
                                {employmentTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleEmploymentType(type)}
                                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                            data.employment_types.includes(type)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        {formatEmploymentType(type)}
                                    </button>
                                ))}
                            </div>
                            {errors.employment_types && <p className="text-sm text-red-600">{errors.employment_types}</p>}
                        </div>

                        {/* Practice Areas */}
                        {practiceAreas.length > 0 && (
                            <div className="space-y-2">
                                <Label>Practice Areas (Optional)</Label>
                                <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 p-3">
                                    <div className="grid grid-cols-1 gap-2">
                                        {practiceAreas.map((area) => (
                                            <label key={area.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.practice_area_ids.includes(area.id)}
                                                    onChange={() => togglePracticeArea(area.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm">{area.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {errors.practice_area_ids && <p className="text-sm text-red-600">{errors.practice_area_ids}</p>}
                            </div>
                        )}

                        {/* Location */}
                        {locations.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="location">Location (Optional)</Label>
                                <Select
                                    value={data.location_id?.toString() || 'all'}
                                    onValueChange={(value) => setData('location_id', value === 'all' ? null : parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {locations.map((location) => (
                                            <SelectItem key={location.id} value={location.id.toString()}>
                                                {getLocationDisplay(location)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.location_id && <p className="text-sm text-red-600">{errors.location_id}</p>}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Alert'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}