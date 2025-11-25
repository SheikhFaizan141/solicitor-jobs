import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { useForm, usePage } from '@inertiajs/react';
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

const CreateJobListing = () => {
    const { firms, practiceAreas, locations } = usePage().props as {
        firms: LawFirm[];
        practiceAreas: PracticeArea[];
        locations: Location[];
    };

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        law_firm_id: '',
        location_id: '',
        location: '', // Legacy field
        workplace_type: 'onsite',
        employment_type: 'full_time',
        experience_level: '',
        salary_min: '',
        salary_max: '',
        salary_currency: 'GBP',
        closing_date: '',
        is_active: true,
        description: '',
        requirements: [''],
        benefits: [''],
        practice_areas: [] as number[],
    });

    const handleSelectChange = (name: keyof typeof data, value: string) => {
        setData(name, value);
    };

    const getLocationDisplay = (location: Location): string => {
        if (location.is_remote) return `${location.name} (Remote)`;
        if (location.region) return `${location.name}, ${location.region}`;
        return location.name;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
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

    // Helper function to get array field errors
    const getArrayFieldError = (field: 'requirements' | 'benefits', index: number): string | undefined => {
        const errorKey = `${field}.${index}`;

        return errors[errorKey as keyof typeof errors] as string | undefined;
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

    const renderTree = (nodes: PracticeArea[], depth = 0) => (
        <ul className={depth === 0 ? 'space-y-1' : 'mt-1 ml-4 space-y-1'}>
            {nodes.map((node) => (
                <li key={node.id}>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={data.practice_areas.includes(node.id)}
                            onChange={() => togglePracticeArea(node.id)}
                        />
                        <span>{node.name}</span>
                    </label>
                    {node.children?.length > 0 && renderTree(node.children, depth + 1)}
                </li>
            ))}
        </ul>
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/job-listings', {
            preserveScroll: true,
        });
    };

    console.log('errors', errors);

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Create Job Listing</h1>
                <p className="mt-2 text-sm text-gray-600">Add a new job listing to the platform.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Basic Information</h2>

                    <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Senior Corporate Lawyer"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="law_firm_id">Law Firm (Optional)</Label>
                        <Select
                            value={data.law_firm_id || 'none'}
                            onValueChange={(value) => handleSelectChange('law_firm_id', value === 'none' ? '' : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a law firm (leave empty for independent posting)" />
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
                        {errors.law_firm_id && <p className="mt-1 text-sm text-red-600">{errors.law_firm_id}</p>}
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Location Information</h2>

                        <div>
                            <Label htmlFor="location_id">Location</Label>
                            <Select
                                value={data.location_id || 'none'}
                                onValueChange={(value) => handleSelectChange('location_id', value === 'none' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a location..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No specific location</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location.id} value={location.id.toString()}>
                                            {getLocationDisplay(location)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.location_id && <p className="mt-1 text-sm text-red-600">{errors.location_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="location">Location (Text) - Fallback</Label>
                            <Input
                                id="location"
                                name="location"
                                value={data.location}
                                onChange={handleChange}
                                placeholder="e.g. London, UK (used if no structured location selected)"
                            />
                            <p className="mt-1 text-xs text-gray-500">This field is used as a fallback when no structured location is selected.</p>
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                        </div>

                        <div>
                            <Label htmlFor="experience_level">Experience Level</Label>
                            <Input
                                id="experience_level"
                                name="experience_level"
                                value={data.experience_level}
                                onChange={handleChange}
                                placeholder="e.g. 3-5 years, Junior, Senior"
                            />
                            {errors.experience_level && <p className="mt-1 text-sm text-red-600">{errors.experience_level}</p>}
                        </div>

                        <div>
                            <Label htmlFor="workplace_type">Workplace Type</Label>
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
                            {errors.workplace_type && <p className="mt-1 text-sm text-red-600">{errors.workplace_type}</p>}
                        </div>

                        <div>
                            <Label htmlFor="employment_type">Employment Type</Label>
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
                            {errors.employment_type && <p className="mt-1 text-sm text-red-600">{errors.employment_type}</p>}
                        </div>
                    </div>
                </div>

                {/* Salary Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Salary Information</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor="salary_min">Minimum Salary</Label>
                            <Input
                                id="salary_min"
                                name="salary_min"
                                type="number"
                                value={data.salary_min}
                                onChange={handleChange}
                                placeholder="50000"
                            />
                            {errors.salary_min && <p className="mt-1 text-sm text-red-600">{errors.salary_min}</p>}
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
                            />
                            {errors.salary_max && <p className="mt-1 text-sm text-red-600">{errors.salary_max}</p>}
                        </div>

                        <div>
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
                            {errors.salary_currency && <p className="mt-1 text-sm text-red-600">{errors.salary_currency}</p>}
                        </div>
                    </div>
                </div>

                {/* Job Details */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Job Details</h2>

                    <div>
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                        <Label htmlFor="closing_date">Application Closing Date</Label>
                        <Input id="closing_date" name="closing_date" type="date" value={data.closing_date} onChange={handleChange} />
                        {errors.closing_date && <p className="mt-1 text-sm text-red-600">{errors.closing_date}</p>}
                    </div>
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Requirements</h2>
                        <Button type="button" variant="outline" onClick={() => addArrayItem('requirements')}>
                            Add Requirement
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {data.requirements.map((requirement, index) => (
                            <div key={index} className="flex gap-3">
                                <Input
                                    value={requirement}
                                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                    placeholder="e.g. 3+ years experience in corporate law"
                                    className="flex-1"
                                />
                                {data.requirements.length > 1 && (
                                    <Button type="button" variant="outline" onClick={() => removeArrayItem('requirements', index)}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Benefits</h2>
                        <Button type="button" variant="outline" onClick={() => addArrayItem('benefits')}>
                            Add Benefit
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {data.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-3">
                                <Input
                                    value={benefit}
                                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                    placeholder="e.g. Competitive pension scheme"
                                    className="flex-1"
                                />
                                {data.benefits.length > 1 && (
                                    <Button type="button" variant="outline" onClick={() => removeArrayItem('benefits', index)}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.benefits && <p className="mt-1 text-sm text-red-600">{errors.benefits}</p>}
                </div>

                {/* Practice Areas */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Practice Areas</h2>
                    <div className="max-h-64 overflow-y-auto rounded border p-4">
                        {tree.length ? renderTree(tree) : <p className="text-sm text-gray-500">No practice areas available.</p>}
                    </div>
                    {errors.practice_areas && <p className="mt-1 text-sm text-red-600">{errors.practice_areas}</p>}
                </div>

                {/* Status */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Status</h2>
                    <div className="flex items-center space-x-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <Label htmlFor="is_active">Active (job is visible and accepting applications)</Label>
                    </div>
                    {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Job Listing'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

CreateJobListing.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateJobListing;
