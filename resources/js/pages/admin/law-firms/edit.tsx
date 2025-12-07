import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

type Contact = {
    id?: number;
    label: string;
    address: string;
    email?: string;
    phone?: string;
};

type PracticeArea = { id: number; name: string; parent_id: number | null };

interface LawFirm {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    website?: string;
    logo_url?: string | null;
    contacts?: Contact[];
    practice_areas?: PracticeArea[];
}

const EditFirm = () => {
    const { lawFirm, practiceAreas } = usePage().props as { lawFirm: LawFirm; practiceAreas: PracticeArea[] };

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: lawFirm.name ?? '',
        slug: lawFirm.slug ?? '',
        description: lawFirm.description ?? '',
        website: lawFirm.website ?? '',
        practice_areas: (lawFirm.practice_areas ?? []).map((pa) => pa.id),
        contacts: (lawFirm.contacts ?? []) as Contact[],
        logo: null as File | null,
        remove_logo: false,
        _method: 'PUT',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    // Build tree
    const tree = React.useMemo(() => {
        const byParent: Record<string, PracticeArea[]> = {};
        practiceAreas.forEach((pa) => {
            const key = (pa.parent_id ?? 'root').toString();
            if (!byParent[key]) byParent[key] = [];
            byParent[key].push(pa);
        });
        const build = (parentKey: string): any[] =>
            (byParent[parentKey] || []).sort((a, b) => a.name.localeCompare(b.name)).map((n) => ({ ...n, children: build(n.id.toString()) }));
        return build('root');
    }, [practiceAreas]);

    const toggleArea = (id: number) => {
        setData('practice_areas', data.practice_areas.includes(id) ? data.practice_areas.filter((x) => x !== id) : [...data.practice_areas, id]);
    };

    const renderTree = (nodes: any[], depth = 0) => (
        <ul className={depth === 0 ? 'space-y-1' : 'mt-1 ml-4 space-y-1'}>
            {nodes.map((node) => (
                <li key={node.id}>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={data.practice_areas.includes(node.id)}
                            onChange={() => toggleArea(node.id)}
                        />
                        <span>{node.name}</span>
                    </label>
                    {node.children?.length > 0 && renderTree(node.children, depth + 1)}
                </li>
            ))}
        </ul>
    );

    // Contact helpers
    const addContact = () => {
        setData('contacts', [...data.contacts, { label: '', address: '', email: '', phone: '' }]);
    };
    const removeContact = (index: number) => {
        setData('contacts', data.contacts.filter((_, i) => i !== index));
    };
    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        const updated = data.contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        setData('contacts', updated);
    };

    // Logo handling
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const [currentLogo, setCurrentLogo] = React.useState<string | null>(lawFirm.logo_url ?? null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        setData('remove_logo', false);

        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
    };

    const handleRemoveNewLogo = () => {
        setData('logo', null);
        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveExistingLogo = () => {
        setCurrentLogo(null);
        setData('remove_logo', true);
        setData('logo', null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/law-firms/${lawFirm.id}`, {
            onSuccess: () => {
                setLogoPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
            },
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Edit Law Firm</h1>
                <p className="mt-2 text-sm text-muted-foreground">Update this law firm's details.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Firm Name</Label>
                    <Input id="name" name="name" value={data.name} onChange={handleChange} required placeholder="Enter firm name" />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <Label htmlFor="slug">Slug (optional)</Label>
                    <Input id="slug" name="slug" value={data.slug} onChange={handleChange} placeholder="Leave blank to keep existing" />
                    <p className="mt-1 text-sm text-muted-foreground">URL-friendly identifier. Auto-generated from name if empty.</p>
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Firm Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        rows={6}
                        className="resize-vertical"
                        placeholder="Enter firm description, practice areas, job opportunities..."
                    />
                    <p className="mt-1 text-sm text-muted-foreground">You can use basic formatting. Line breaks will be preserved.</p>
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" type="url" value={data.website} onChange={handleChange} placeholder="Enter website URL" />
                    {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                </div>

                {/* Firm Logo */}
                <div>
                    <Label htmlFor="logo">Firm Logo (optional)</Label>
                    
                    {/* Show current logo if exists and not being removed */}
                    {currentLogo && !data.remove_logo && !logoPreview && (
                        <div className="mt-2 flex items-center gap-3 rounded border p-3 bg-gray-50">
                            <img src={currentLogo} alt="Current logo" className="h-20 w-20 rounded object-contain bg-white border" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Current Logo</p>
                                <p className="text-xs text-muted-foreground">Upload a new file to replace</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleRemoveExistingLogo}>
                                Remove
                            </Button>
                        </div>
                    )}

                    <Input 
                        id="logo" 
                        name="logo" 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp" 
                        onChange={handleFileChange} 
                        ref={fileInputRef}
                        className="mt-2"
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                        Max 512KB. Accepted formats: JPG, PNG, SVG, WebP
                    </p>
                    {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}

                    {/* Show preview of newly selected logo */}
                    {logoPreview && (
                        <div className="mt-3 flex items-center gap-3 rounded border p-3 bg-blue-50">
                            <img src={logoPreview} alt="New logo preview" className="h-20 w-20 rounded object-contain bg-white border" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">New Logo Preview</p>
                                <p className="text-xs text-muted-foreground">This will replace the current logo</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleRemoveNewLogo}>
                                Remove
                            </Button>
                        </div>
                    )}
                </div>

                {/* Contact Details */}
                <ContactDetails
                    contacts={data.contacts}
                    onChange={handleContactChange}
                    addContact={addContact}
                    removeContact={removeContact}
                    errors={errors}
                />

                <div>
                    <Label>Practice Areas</Label>
                    <div className="mt-2 max-h-64 overflow-y-auto rounded border p-3">
                        {tree.length ? renderTree(tree) : <p className="text-sm text-gray-500">No practice areas yet.</p>}
                    </div>
                    {errors.practice_areas && <p className="mt-1 text-sm text-red-600">{errors.practice_areas}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {recentlySuccessful && !processing && <span className="text-sm text-green-600">Saved successfully</span>}
                </div>
            </form>
        </div>
    );
};

function ContactDetails({
    contacts,
    onChange,
    addContact,
    removeContact,
    errors,
}: {
    contacts: Contact[];
    onChange: (index: number, field: keyof Contact, value: string) => void;
    addContact: () => void;
    removeContact: (index: number) => void;
    errors: any;
}) {
    return (
        <section>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Contact addresses</h2>
                <Button type="button" onClick={addContact}>
                    Add address
                </Button>
            </div>

            <div className="mt-3 space-y-4">
                {contacts.map((c, idx) => (
                    <div key={idx} className="rounded border p-5">
                        <div className="grid gap-2">
                            <div className="flex items-end gap-3">
                                <div style={{ flex: 1 }}>
                                    <Label htmlFor={`contacts.${idx}.label`}>Label</Label>
                                    <Input
                                        id={`contacts.${idx}.label`}
                                        value={c.label}
                                        onChange={(e) => onChange(idx, 'label', e.target.value)}
                                        placeholder="e.g. London, Head Office"
                                    />
                                </div>
                                <div>
                                    <Button type="button" variant="secondary" onClick={() => removeContact(idx)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor={`contacts.${idx}.address`}>Address</Label>
                                <Textarea
                                    id={`contacts.${idx}.address`}
                                    value={c.address}
                                    onChange={(e) => onChange(idx, 'address', e.target.value)}
                                    rows={4}
                                    placeholder="Street, city, postcode..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`contacts.${idx}.email`}>Email</Label>
                                    <Input
                                        id={`contacts.${idx}.email`}
                                        type="email"
                                        value={c.email}
                                        onChange={(e) => onChange(idx, 'email', e.target.value)}
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`contacts.${idx}.phone`}>Phone</Label>
                                    <Input
                                        id={`contacts.${idx}.phone`}
                                        value={c.phone}
                                        onChange={(e) => onChange(idx, 'phone', e.target.value)}
                                        placeholder="+44 20 7..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

EditFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default EditFirm;