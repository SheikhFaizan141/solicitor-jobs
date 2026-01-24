import { Contact } from '@/types/law-firms';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface ContactDetailsProps {
    contacts: Contact[];
    onChange: (index: number, field: keyof Contact, value: string) => void;
    addContact: () => void;
    removeContact: (index: number) => void;
    errors: Record<string, string>;
}

export default function ContactDetails({ contacts, onChange, addContact, removeContact, errors }: ContactDetailsProps) {
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
                                    {errors[`contacts.${idx}.label`] && <InputError message={errors[`contacts.${idx}.label`]} className="mt-1" />}
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
                                {errors[`contacts.${idx}.address`] && <InputError message={errors[`contacts.${idx}.address`]} className="mt-1" />}
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
                                    {errors[`contacts.${idx}.email`] && <InputError message={errors[`contacts.${idx}.email`]} className="mt-1" />}
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
                                    {errors[`contacts.${idx}.phone`] && <InputError message={errors[`contacts.${idx}.phone`]} className="mt-1" />}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
