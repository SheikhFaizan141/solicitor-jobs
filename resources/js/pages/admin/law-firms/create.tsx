import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

type Contact = {
    label: string;
    address: string;
    email?: string;
    phone?: string;
};

type PracticeArea = { id: number; name: string; parent_id: number | null };

const CreateFirm = () => {
    const { practiceAreas } = usePage().props as { practiceAreas: PracticeArea[] };

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        website: '',
        practice_areas: [] as number[], // IDs of selected practice areas
        // multiple contact info
        contacts: [
            {
                label: '',
                address: '',
                email: '',
                phone: '',
            },
        ] as Contact[],
        logo: null as File | null,
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
        const build = (parentKey: string): PracticeArea[] =>
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
        const next = [...(data.contacts ?? []), { label: '', address: '', email: '', phone: '' }];
        setData('contacts', next);
    };
    const removeContact = (index: number) => {
        const next = (data.contacts ?? []).filter((_: Contact, i: number) => i !== index);
        setData('contacts', next);
    };
    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        const contacts = (data.contacts ?? []) as Contact[];
        const updated = contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        setData('contacts', updated);
    };

    // Preview and file input ref
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);

        // Create/revoke preview URL
        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
    };

    const handleRemoveLogo = () => {
        setData('logo', null);
        setLogoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Submitting form with data:', data);

        post('/admin/law-firms', {
            onSuccess: () => {
                // Clean up preview URL and reset form
                setLogoPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
                reset();
            },
            preserveScroll: true,
            forceFormData: true, // ensure multipart/form-data
        });
    };

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
            <header>
                <h1 className="text-2xl font-bold">Create Law Firm</h1>
                <p className="mt-2">This is the page to create a new law firm listing.</p>
            </header>

            <div className="mt-6">
                <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <Label htmlFor="name">Firm Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={handleChange} required placeholder="Enter firm name" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Slug omitted: server auto-generates */}
                    <div>
                        <Label htmlFor="description">Firm Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Enter firm description, practice areas, job opportunities..."
                            rows={6}
                            className="resize-vertical"
                        />
                        <p className="mt-1 text-sm text-muted-foreground">You can use basic formatting. Line breaks will be preserved.</p>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" type="url" value={data.website} onChange={handleChange} placeholder="Enter website URL" />
                        {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                    </div>
                    {/* Contact Details */}
                    <ContactDetails
                        contacts={(data.contacts ?? []) as Contact[]}
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

                    {/* Optional file upload */}
                    <div>
                        <Label htmlFor="logo">Firm Logo</Label>
                        <Input id="logo" name="logo" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                        {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}

                        {logoPreview && (
                            <div className="mt-3 flex items-center gap-3">
                                <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded border object-cover" />
                                <Button type="button" variant="secondary" onClick={handleRemoveLogo}>
                                    Remove logo
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Firm'}
                    </Button>
                </form>
            </div>
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
                                        name={`contacts.${idx}.label`}
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
                                    name={`contacts.${idx}.address`}
                                    value={c.address}
                                    onChange={(e) => onChange(idx, 'address', e.target.value)}
                                    rows={4}
                                    placeholder="Street, city, postcode..."
                                />
                                {/* optionally display errors per-contact if backend returns structured errors */}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`contacts.${idx}.email`}>Email</Label>
                                    <Input
                                        id={`contacts.${idx}.email`}
                                        name={`contacts.${idx}.email`}
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
                                        name={`contacts.${idx}.phone`}
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

CreateFirm.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateFirm;
