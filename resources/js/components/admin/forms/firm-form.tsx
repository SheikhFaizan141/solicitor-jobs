import InputError from '@/components/input-error';
import PracticeAreaTree from '@/components/practice-area-tree';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { buildPracticeAreaTree } from '@/lib/practice-area-tree';
import { Contact } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface LawFirmFormData {
    name: string;
    slug?: string;
    description: string;
    excerpt: string;
    is_active: boolean;
    website: string;
    practice_areas: number[];
    contacts: Contact[];
    logo: File | null;
    remove_logo?: boolean;
    _method?: string;
}

interface FirmFormProps {
    data: LawFirmFormData; // Type as LawFirmFormData
    setData: (key: keyof LawFirmFormData, value: LawFirmFormData[keyof LawFirmFormData]) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    practiceAreas: PracticeArea[];
    isEdit?: boolean;
    currentLogoUrl?: string | null;
    submitLabel: string;
}

export default function ({ data, setData, errors, processing, onSubmit, practiceAreas, isEdit = false, currentLogoUrl, submitLabel }: FirmFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Priority: New Upload Preview > Existing Server URL (unless marked for removal) > Null
    const displayUrl = previewUrl || (!data.remove_logo && currentLogoUrl) || null;

    const tree = useMemo(() => buildPracticeAreaTree(practiceAreas), [practiceAreas]);
    const toggleArea = (id: number) => {
        setData('practice_areas', data.practice_areas.includes(id) ? data.practice_areas.filter((x) => x !== id) : [...data.practice_areas, id]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Cleanup old preview if exists
            if (previewUrl) URL.revokeObjectURL(previewUrl);

            const newUrl = URL.createObjectURL(file);
            setPreviewUrl(newUrl);
            setData('logo', file);

            // If we are replacing an existing image, ensure we don't accidentally send the "remove" flag
            if (isEdit) setData('remove_logo', false);
        }
    };

    const handleRemoveImage = () => {
        // Scenario A: Removing a just-uploaded file (Draft)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setData('logo', null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // If there was an old image behind this new one, we theoretically show it again?
            // Or we assume the user wants NO image?
            // Let's assume they want to clear everything.
            if (isEdit) setData('remove_logo', true);
        }
        // Scenario B: Removing an existing server image
        else if (currentLogoUrl) {
            setData('remove_logo', true);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Contact Management Handlers
    const addContact = () => {
        const current = data.contacts || [];
        setData('contacts', [...current, { label: '', address: '', email: '', phone: '' }]);
    };

    const removeContact = (index: number) => {
        const current = data.contacts || [];
        setData(
            'contacts',
            current.filter((_, i) => i !== index),
        );
    };

    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        const current = data.contacts || [];
        const updated = current.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        setData('contacts', updated);
    };

    return (
        <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-8">
            {/* Two-column grid: main fields left, sidebar right */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* ── Left column (main content, 2/3 width) ── */}
                <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm lg:col-span-2">
                    <div>
                        <Label htmlFor="name">Firm Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Enter firm name"
                            className="mt-1"
                        />
                        {errors.name && <InputError message={errors.name} className="mt-2" />}
                    </div>

                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            type="url"
                            value={data.website}
                            onChange={(e) => setData('website', e.target.value)}
                            placeholder="https://example.com"
                            className="mt-1"
                        />
                        {errors.website && <InputError message={errors.website} className="mt-2" />}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <RichTextEditor
                            value={data.description}
                            onChange={(html) => setData('description', html)}
                            error={errors.description}
                            placeholder="Describe the law firm, practice areas, expertise, culture..."
                        />
                        {errors.description && <InputError message={errors.description} className="mt-2" />}
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Short Summary / Excerpt</Label>
                        <p className="mb-1 text-xs text-muted-foreground">
                            Plain-text blurb shown in search results, previews, and SEO meta descriptions. Max 500 characters.
                        </p>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="A concise summary of the firm's expertise and services..."
                            className="mt-1 resize-none"
                        />
                        <p className="mt-1 text-right text-xs text-muted-foreground">{data.excerpt.length} / 500</p>
                        {errors.excerpt && <InputError message={errors.excerpt} className="mt-2" />}
                    </div>
                </div>

                {/* ── Right column (sidebar, 1/3 width) ── */}
                <div className="space-y-6">
                    {/* Visibility */}
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Visibility</h3>
                        <label htmlFor="is_active" className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="space-y-0.5">
                                <span className="block text-sm leading-none font-medium">Active</span>
                                <span className="block text-xs text-muted-foreground">Firm is publicly visible on the site</span>
                            </span>
                        </label>
                    </div>

                    {/* Logo Upload */}
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Firm Logo</h3>
                        {/* Hidden Native Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileSelect}
                        />

                        <div className="flex items-start gap-4">
                            {/* Visual Area */}
                            <div
                                className={`relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed ${displayUrl ? 'border-solid border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'}`}
                            >
                                {displayUrl ? (
                                    <img src={displayUrl} alt="Logo preview" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <ImagePlus className="mx-auto h-7 w-7 opacity-50" />
                                        <span className="mt-1 block text-xs font-medium">No Logo</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions Area */}
                            <div className="flex flex-col gap-2 pt-1">
                                {displayUrl ? (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Change
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="w-full justify-start gap-2"
                                            onClick={handleRemoveImage}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            Upload Logo
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            500×500px recommended
                                            <br />
                                            Max 2MB · JPG, PNG, WebP
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {errors.logo && <p className="mt-2 text-sm text-red-600">{errors.logo}</p>}
                    </div>

                    {/* Practice Areas */}
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Practice Areas</h3>
                        <div className="max-h-64 overflow-y-auto rounded-md border p-3">
                            {tree.length ? (
                                <PracticeAreaTree nodes={tree} selected={data.practice_areas} onToggle={toggleArea} />
                            ) : (
                                <p className="text-sm text-gray-500">No practice areas yet.</p>
                            )}
                        </div>
                        {errors.practice_areas && <InputError message={errors.practice_areas} className="mt-2" />}
                    </div>
                </div>
            </div>

            {/* ── Full-width: Contact Addresses ── */}
            <div className="space-y-4 rounded-lg bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Contact Addresses</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addContact}>
                        Add Address
                    </Button>
                </div>

                <div className="space-y-4">
                    {data.contacts.map((c, idx) => (
                        <div key={idx} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                            <div className="grid gap-4">
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <Label htmlFor={`contact_${idx}_label`}>Label</Label>
                                        <Input
                                            id={`contact_${idx}_label`}
                                            value={c.label}
                                            onChange={(e) => handleContactChange(idx, 'label', e.target.value)}
                                            placeholder="e.g. Head Office"
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeContact(idx)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div>
                                    <Label htmlFor={`contact_${idx}_address`}>Address</Label>
                                    <Textarea
                                        id={`contact_${idx}_address`}
                                        value={c.address}
                                        onChange={(e) => handleContactChange(idx, 'address', e.target.value)}
                                        rows={2}
                                        className="mt-1 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`contact_${idx}_email`}>Email</Label>
                                        <Input
                                            id={`contact_${idx}_email`}
                                            type="email"
                                            value={c.email}
                                            onChange={(e) => handleContactChange(idx, 'email', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`contact_${idx}_phone`}>Phone</Label>
                                        <Input
                                            id={`contact_${idx}_phone`}
                                            value={c.phone}
                                            onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.contacts.length === 0 && <p className="text-sm text-muted-foreground italic">No contact addresses added yet.</p>}
                </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
