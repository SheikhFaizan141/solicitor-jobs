import { RichTextEditor } from '@/components/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { LawFirm } from '@/types/law-firms';
import { Location } from '@/types/locations';
import { PracticeArea, PracticeAreaTreeNode } from '@/types/practice-area';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

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
    excerpt: string;
    external_link: string;
    requirements: string[];
    benefits: string[];
    practice_areas: number[];
};

interface JobListingFormProps {
    data: FormData;
    setData: (field: keyof FormData, value: FormData[keyof FormData]) => void;
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
        const build = (parentKey: string): PracticeAreaTreeNode[] =>
            (byParent[parentKey] || []).sort((a, b) => a.name.localeCompare(b.name)).map((n) => ({ ...n, children: build(n.id.toString()) }));
        return build('root');
    }, [practiceAreas]);

    const renderTree = (nodes: PracticeAreaTreeNode[], depth = 0): React.ReactNode => (
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
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Column */}
            <div className="space-y-6 lg:col-span-2">
                {/* Job Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                        <CardDescription>Essential details about the job position.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={data.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior Corporate Lawyer"
                                required
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Full Description</Label>
                            <RichTextEditor
                                value={data.description}
                                onChange={(val) => setData('description', val)}
                                placeholder="Describe the role, responsibilities, and company culture..."
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Short Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                value={data.excerpt}
                                onChange={handleChange}
                                placeholder="A brief summary for search results (optional)"
                                className="h-20"
                            />
                            {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Requirements & Benefits Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requirements & Benefits</CardTitle>
                        <CardDescription>List specific qualifications and perks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Requirements */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Requirements</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('requirements')}>
                                    <Plus className="h-4 w-4" />
                                    {/* Add Requirement */}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={req}
                                            onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                            placeholder="e.g. 5+ years experience in Family Law"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem('requirements', index)}>
                                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                                        </Button>
                                    </div>
                                ))}
                                {data.requirements.length === 0 && <p className="text-sm text-gray-400 italic">No requirements added yet.</p>}
                            </div>
                        </div>

                        <Separator />

                        {/* Benefits */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Benefits</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('benefits')}>
                                    <Plus className="h-4 w-4" />
                                    {/* Add Benefit */}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={benefit}
                                            onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                            placeholder="e.g. Remote work options, Health insurance"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem('benefits', index)}>
                                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                                        </Button>
                                    </div>
                                ))}
                                {data.benefits.length === 0 && <p className="text-sm text-gray-400 italic">No benefits added yet.</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* External Link Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>External Application</CardTitle>
                        <CardDescription>Where should candidates apply?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="external_link">External Link</Label>
                            <Input
                                id="external_link"
                                name="external_link"
                                value={data.external_link}
                                onChange={handleChange}
                                placeholder="https://example.com/apply or mailto:hr@firm.com"
                            />
                            <p className="text-xs text-gray-500">Enter a URL or mailto: link.</p>
                            {errors.external_link && <p className="text-sm text-red-500">{errors.external_link}</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6 lg:col-span-1">
                {/* Status Card */}
                <Card className="bg-slate-50">
                    <CardHeader>
                        <CardTitle>Publication Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Active Status
                            </Label>
                            <Badge variant={data.is_active ? 'default' : 'secondary'}>{data.is_active ? 'Published' : 'Draft'}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer font-normal">
                                Publish this job listing
                            </Label>
                        </div>

                        <Separator className="my-2" />

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Saving...' : submitLabel}
                        </Button>
                    </CardContent>
                </Card>

                {/* Organization Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Organization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="law_firm_id">Law Firm</Label>
                            <Select
                                value={data.law_firm_id || 'none'}
                                onValueChange={(value) => handleSelectChange('law_firm_id', value === 'none' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select firm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— Independent —</SelectItem>
                                    {firms.map((firm) => (
                                        <SelectItem key={firm.id} value={firm.id.toString()}>
                                            {firm.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.law_firm_id && <p className="text-sm text-red-500">{errors.law_firm_id}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Location & Type Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Location & Type</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="location_id">Location</Label>
                            <Select
                                value={data.location_id || 'none'}
                                onValueChange={(value) => handleSelectChange('location_id', value === 'none' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— Any —</SelectItem>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>
                                            {getLocationDisplay(loc)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.location_id && <p className="text-sm text-red-500">{errors.location_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="workplace_type">Workplace</Label>
                            <Select value={data.workplace_type} onValueChange={(value) => handleSelectChange('workplace_type', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onsite">On-site</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.workplace_type && <p className="text-sm text-red-500">{errors.workplace_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employment_type">Employment</Label>
                            <Select value={data.employment_type} onValueChange={(value) => handleSelectChange('employment_type', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full-time</SelectItem>
                                    <SelectItem value="part_time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.employment_type && <p className="text-sm text-red-500">{errors.employment_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience_level">Experience</Label>
                            <Input
                                id="experience_level"
                                name="experience_level"
                                value={data.experience_level}
                                onChange={handleChange}
                                placeholder="e.g. 3-5 years"
                            />
                            {errors.experience_level && <p className="text-sm text-red-500">{errors.experience_level}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Compensation Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compensation</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="salary_currency">Currency</Label>
                            <Select value={data.salary_currency} onValueChange={(value) => handleSelectChange('salary_currency', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary_min">Min</Label>
                            <Input id="salary_min" name="salary_min" type="number" value={data.salary_min} onChange={handleChange} placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary_max">Max</Label>
                            <Input id="salary_max" name="salary_max" type="number" value={data.salary_max} onChange={handleChange} placeholder="0" />
                        </div>
                        {(errors.salary_min || errors.salary_max) && <p className="col-span-2 text-sm text-red-500">Check salary values</p>}
                    </CardContent>
                </Card>

                {/* Dates Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="closing_date">Closing Date</Label>
                            <Input id="closing_date" name="closing_date" type="date" value={data.closing_date} onChange={handleChange} />
                            {errors.closing_date && <p className="text-sm text-red-500">{errors.closing_date}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Practice Areas Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Practice Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-80 overflow-y-auto rounded-md border p-2">
                            {renderTree(tree)}
                            {practiceAreas.length === 0 && <p className="p-2 text-sm text-gray-500">No practice areas available.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
