import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Role } from '@/types';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';

export type UserFormData = {
    name: string;
    email: string;
    role: string;
    password: string;
};

export interface UserFormProps {
    data: UserFormData;
    setData: (key: keyof UserFormData, value: string) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    roles: string[];
    mode: 'create' | 'edit';
    onSubmit: (e: FormEvent) => void;
    onCancelHref: string;
    isSelfEdit?: boolean;
}

const roleDescriptions: Record<Role, string> = {
    admin: 'Full access to all admin features and user management.',
    editor: 'Can manage listings and content, but not admin-only settings.',
    user: 'Basic account role with no admin area access.',
};

const formatRoleLabel = (role: string) => role.charAt(0).toUpperCase() + role.slice(1);

export default function UserForm({ data, setData, errors, processing, roles, mode, onSubmit, onCancelHref, isSelfEdit = false }: UserFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const selectedRoleDescription = useMemo(() => {
        if (!data.role) {
            return 'Choose a role for this account.';
        }

        return roleDescriptions[data.role as Role] ?? 'Choose a role for this account.';
    }, [data.role]);

    const submitLabel = mode === 'create' ? 'Create User' : 'Save Changes';
    const processingLabel = mode === 'create' ? 'Creating...' : 'Saving...';
    const passwordHint = mode === 'create' ? 'Minimum 8 characters.' : 'Leave blank to keep current password.';

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle>{mode === 'create' ? 'User details' : 'Update user details'}</CardTitle>
                <p className="text-sm text-muted-foreground">Fill in the account information and assign an access role.</p>
            </CardHeader>

            <CardContent>
                <form id="admin-user-form" onSubmit={onSubmit} className="space-y-5">
                    {errors.general && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Unable to save user</AlertTitle>
                            <AlertDescription>
                                <p>{errors.general}</p>
                            </AlertDescription>
                        </Alert>
                    )}

                    {isSelfEdit && mode === 'edit' && (
                        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Editing your own account</AlertTitle>
                            <AlertDescription>
                                <p>Keep your role as Admin to avoid losing access to this section.</p>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter full name"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" required value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {formatRoleLabel(role)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">{selectedRoleDescription}</p>
                        <InputError message={errors.role} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={mode === 'create' ? 'Create a strong password' : 'Enter new password'}
                                className="pr-10"
                                required={mode === 'create'}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{passwordHint}</p>
                        <InputError message={errors.password} />
                    </div>
                </form>
            </CardContent>

            <CardFooter className="gap-3 border-t pt-6">
                <Button type="submit" form="admin-user-form" disabled={processing}>
                    {processing ? processingLabel : submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href={onCancelHref}>Cancel</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
