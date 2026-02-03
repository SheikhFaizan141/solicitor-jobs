import { cn } from '@/lib/utils';
import { Location } from '@/types/locations';
import { PracticeArea } from '@/types/practice-area';
import { X } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface JobFiltersSidebarProps {
    searchTerm: string;
    selectedLocationId: string;
    selectedPracticeAreaId: string;
    selectedType: string;
    selectedExperience: string;
    hasActiveFilters: boolean;
    filters: {
        locations: Location[];
        employment_types: string[];
        experience_levels: string[];
        practiceAreas: PracticeArea[];
    };
    onSearchChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onPracticeAreaChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onExperienceChange: (value: string) => void;
    onApplyFilters: (e?: FormEvent) => void;
    onClearFilters: () => void;
    className?: string;
    variant?: 'sidebar' | 'sheet';
}

export function JobFiltersSidebar({
    searchTerm,
    selectedLocationId,
    selectedPracticeAreaId,
    selectedType,
    selectedExperience,
    hasActiveFilters,
    filters,
    onSearchChange,
    onLocationChange,
    onPracticeAreaChange,
    onTypeChange,
    onExperienceChange,
    onApplyFilters,
    onClearFilters,
    className,
    variant = 'sidebar',
}: JobFiltersSidebarProps) {
    const isSheet = variant === 'sheet';

    const getLocationDisplay = (location: Location): string => {
        const parts = [location.name];
        if (location.region) parts.push(location.region);
        if (location.is_remote) parts.push('(Remote)');
        return parts.join(', ');
    };

    const formatEmploymentType = (type: string) => {
        return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };
    return (
        <div className={cn(isSheet ? 'w-full' : 'lg:w-1/4', className)}>
            <div
                className={cn(
                    'rounded-lg border border-gray-200 bg-white shadow-sm',
                    isSheet ? 'max-h-[calc(100vh-8rem)] overflow-y-auto border-none p-0 shadow-none' : 'sticky top-24 p-6',
                )}
            >
                <div className={cn('flex flex-wrap items-center justify-between gap-2', isSheet ? 'border-b border-gray-100 px-4 py-4' : 'mb-4')}>
                    <h2 className="text-lg font-semibold text-gray-900">Filter Jobs</h2>
                    {hasActiveFilters && (
                        <button onClick={onClearFilters} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <X className="h-4 w-4" />
                            Clear
                        </button>
                    )}
                </div>

                <form onSubmit={onApplyFilters} className={cn('space-y-6', isSheet ? 'px-4 py-4' : undefined)}>
                    {/* Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Job title, law firm, practice area..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select value={selectedLocationId || undefined} onValueChange={(value) => onLocationChange(value === 'all' ? '' : value)}>
                            <SelectTrigger id="location">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {filters.locations.map((location) => (
                                    <SelectItem key={location.id} value={location.id.toString()}>
                                        {getLocationDisplay(location)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Practice Area */}
                    <div className="space-y-2">
                        <Label htmlFor="practice-area">Practice Area</Label>
                        <Select
                            value={selectedPracticeAreaId || undefined}
                            onValueChange={(value) => onPracticeAreaChange(value === 'all' ? '' : value)}
                        >
                            <SelectTrigger id="practice-area">
                                <SelectValue placeholder="All Practice Areas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Practice Areas</SelectItem>
                                {filters.practiceAreas.map((area) => (
                                    <SelectItem key={area.id} value={area.id.toString()}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Job Type */}
                    <div className="space-y-2">
                        <Label htmlFor="job-type">Job Type</Label>
                        <Select value={selectedType || undefined} onValueChange={(value) => onTypeChange(value === 'all' ? '' : value)}>
                            <SelectTrigger id="job-type">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {filters.employment_types.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {formatEmploymentType(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select value={selectedExperience || undefined} onValueChange={(value) => onExperienceChange(value === 'all' ? '' : value)}>
                            <SelectTrigger id="experience">
                                <SelectValue placeholder="All Levels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                {filters.experience_levels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                        {level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Apply / Clear Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                            Apply Filters
                        </Button>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                onClick={onClearFilters}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
