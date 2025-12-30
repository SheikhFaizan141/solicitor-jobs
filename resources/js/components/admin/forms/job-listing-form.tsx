import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type LawFirm = {
    id: number;
    name: string;
};

type PracticeArea = {
    id: number;
    name: string;
    parent_id: number | null;
    children?: PracticeArea[];
};

type Location = {
    id: number;
    name: string;
    region: string | null;
    country: string;
    is_remote: boolean;
};

type FormData = {
    title: string;
    law_firm_id: string;
    location_id: string;
    workplace_type: string;
    employment_type: string;
    experience_level: string;
    salary_min: string;
    salary_max: string;
    salary_currency: string;
    closing_date: string;
    is_active: boolean;
    description: string;
    requirements: string[];
    benefits: string[];
    practice_areas: number[];
};

interface JobListingFormProps {
    data: FormData;
    setData: (field: keyof FormData, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    firms: LawFirm[];
    practiceAreas: PracticeArea[];
    locations: Location[];
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export function JobListingForm({ data, setData, errors, processing, firms, practiceAreas, locations, onSubmit, submitLabel }: JobListingFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        setData(name, value);
    };

    const handleArrayChange = (field: 'requirements' | 'benefits', index: number, value: string) => {
        const current = data[field] as string[];
        const updated = current.map((item, i) => (i === index ? value : item));
        setData(field, updated);
    };

    const addArrayItem = (field: 'requirements' | 'benefits') => {
        const current = data[field] as string[];
        setData(field, [...current, '']);
    };

    const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
        const current = data[field] as string[];
        setData(
            field,
            current.filter((_, i) => i !== index),
        );
    };

    const togglePracticeArea = (id: number) => {
        const current = data.practice_areas;
        setData('practice_areas', current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    };

    const getLocationDisplay = (location: Location): string => {
        const parts = [location.name];
        if (location.region) parts.push(location.region);
        if (location.is_remote) parts.push('(Remote)');
        return parts.join(', ');
    };

    // Build practice area tree
    const tree = React.useMemo(() => {
        const byParent: Record<string, PracticeArea[]> = {};
        practiceAreas.forEach((pa) => {
            const key = (pa.parent_id ?? 'root').toString();
            if (!byParent[key]) byParent[key] = [];
            byParent[key].push(pa);
        });
        const build = (parentKey: string): PracticeArea[] =>
            (byParent[parentKey] || []).sort((a, b) => a.name.localeCompare(b.name)).map((n) => ({ ...n, children: build(n.id.toString()) }));
        return build('root');
    }, [practiceAreas]);

    const renderTree = (nodes: PracticeArea[], depth = 0): React.ReactNode => (
        <ul className={depth === 0 ? 'space-y-1' : 'mt-1 ml-4 space-y-1'}>
            {nodes.map((node) => (
                <li key={node.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm hover:text-gray-700">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={data.practice_areas.includes(node.id)}
                            onChange={() => togglePracticeArea(node.id)}
                        />
                        <span>{node.name}</span>
                    </label>
                    {node.children && node.children.length > 0 && renderTree(node.children, depth + 1)}
                </li>
            ))}
        </ul>
    );

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                    <p className="mt-1 text-sm text-gray-600">Essential details about the job position</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">
                            Job Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Senior Corporate Lawyer"
                            className="mt-1.5"
                        />
                        {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="law_firm_id">Law Firm</Label>
                        <Select
                            value={data.law_firm_id || 'none'}
                            onValueChange={(value) => handleSelectChange('law_firm_id', value === 'none' ? '' : value)}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="Select a law firm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">— No firm (Independent) —</SelectItem>
                                {firms.map((firm) => (
                                    <SelectItem key={firm.id} value={firm.id.toString()}>
                                        {firm.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="mt-1.5 text-xs text-gray-500">Leave empty for independent job postings</p>
                        {errors.law_firm_id && <p className="mt-1.5 text-sm text-red-600">{errors.law_firm_id}</p>}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Location & Work Details */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Location & Work Details</h2>
                    <p className="mt-1 text-sm text-gray-600">Where and how the work will be performed</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Label htmlFor="location_id">Location</Label>
                        <Select
                            value={data.location_id || 'none'}
                            onValueChange={(value) => handleSelectChange('location_id', value === 'none' ? '' : value)}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">— No specific location —</SelectItem>
                                {locations.map((location) => (
                                    <SelectItem key={location.id} value={location.id.toString()}>
                                        {getLocationDisplay(location)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.location_id && <p className="mt-1.5 text-sm text-red-600">{errors.location_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="workplace_type">
                            Workplace Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={data.workplace_type} onValueChange={(value) => handleSelectChange('workplace_type', value)}>
                            <SelectTrigger className="mt-1.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="onsite">On-site</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.workplace_type && <p className="mt-1.5 text-sm text-red-600">{errors.workplace_type}</p>}
                    </div>

                    <div>
                        <Label htmlFor="employment_type">
                            Employment Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={data.employment_type} onValueChange={(value) => handleSelectChange('employment_type', value)}>
                            <SelectTrigger className="mt-1.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full_time">Full-time</SelectItem>
                                <SelectItem value="part_time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.employment_type && <p className="mt-1.5 text-sm text-red-600">{errors.employment_type}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="experience_level">Experience Level</Label>
                        <Input
                            id="experience_level"
                            name="experience_level"
                            value={data.experience_level}
                            onChange={handleChange}
                            placeholder="e.g. 3-5 years, Junior, Senior"
                            className="mt-1.5"
                        />
                        {errors.experience_level && <p className="mt-1.5 text-sm text-red-600">{errors.experience_level}</p>}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Compensation */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Compensation</h2>
                    <p className="mt-1 text-sm text-gray-600">Salary range and currency</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <Label htmlFor="salary_min">Minimum Salary</Label>
                        <Input
                            id="salary_min"
                            name="salary_min"
                            type="number"
                            value={data.salary_min}
                            onChange={handleChange}
                            placeholder="50000"
                            className="mt-1.5"
                        />
                        {errors.salary_min && <p className="mt-1.5 text-sm text-red-600">{errors.salary_min}</p>}
                    </div>

                    <div>
                        <Label htmlFor="salary_max">Maximum Salary</Label>
                        <Input
                            id="salary_max"
                            name="salary_max"
                            type="number"
                            value={data.salary_max}
                            onChange={handleChange}
                            placeholder="80000"
                            className="mt-1.5"
                        />
                        {errors.salary_max && <p className="mt-1.5 text-sm text-red-600">{errors.salary_max}</p>}
                    </div>

                    <div>
                        <Label htmlFor="salary_currency">
                            Currency <span className="text-red-500">*</span>
                        </Label>
                        <Select value={data.salary_currency} onValueChange={(value) => handleSelectChange('salary_currency', value)}>
                            <SelectTrigger className="mt-1.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.salary_currency && <p className="mt-1.5 text-sm text-red-600">{errors.salary_currency}</p>}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Job Description */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
                    <p className="mt-1 text-sm text-gray-600">Detailed information about the role</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="description">Description</Label>
                        {/* <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                            className="mt-1.5"
                        /> */}

                        <RichTextEditor
                            value={data.description}
                            onChange={(html) => setData('description', html)}
                            error={errors.description}
                            placeholder="Enter job description with formatting..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="closing_date">Application Deadline</Label>
                        <Input
                            id="closing_date"
                            name="closing_date"
                            type="date"
                            value={data.closing_date}
                            onChange={handleChange}
                            className="mt-1.5"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">When should applications close?</p>
                        {errors.closing_date && <p className="mt-1.5 text-sm text-red-600">{errors.closing_date}</p>}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
                        <p className="mt-1 text-sm text-gray-600">Qualifications and skills needed</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('requirements')}>
                        Add Requirement
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.requirements.map((requirement, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={requirement}
                                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                placeholder="e.g. 3+ years experience in corporate law"
                                className="flex-1"
                            />
                            {data.requirements.length > 1 && (
                                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('requirements', index)}>
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                {errors.requirements && <p className="mt-1.5 text-sm text-red-600">{errors.requirements}</p>}
            </div>

            <Separator />

            {/* Benefits */}
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
                        <p className="mt-1 text-sm text-gray-600">What's offered with this position</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('benefits')}>
                        Add Benefit
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={benefit}
                                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                placeholder="e.g. Competitive pension scheme"
                                className="flex-1"
                            />
                            {data.benefits.length > 1 && (
                                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('benefits', index)}>
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                {errors.benefits && <p className="mt-1.5 text-sm text-red-600">{errors.benefits}</p>}
            </div>

            <Separator />

            {/* Practice Areas */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Practice Areas</h2>
                    <p className="mt-1 text-sm text-gray-600">Select relevant legal practice areas</p>
                </div>

                <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                    {tree.length ? renderTree(tree) : <p className="text-sm text-gray-500">No practice areas available.</p>}
                </div>
                {errors.practice_areas && <p className="mt-1.5 text-sm text-red-600">{errors.practice_areas}</p>}
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Publication Status</h2>
                    <p className="mt-1 text-sm text-gray-600">Control job listing visibility</p>
                </div>

                <div className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <input
                        id="is_active"
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                        <Label htmlFor="is_active" className="cursor-pointer font-medium">
                            Active
                        </Label>
                        <p className="text-sm text-gray-600">Job is visible and accepting applications</p>
                    </div>
                </div>
                {errors.is_active && <p className="mt-1.5 text-sm text-red-600">{errors.is_active}</p>}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={processing} size="lg">
                    {processing ? 'Saving...' : submitLabel}
                </Button>
                <p className="text-sm text-gray-500">All required fields are marked with *</p>
            </div>
        </form>
    );
}
