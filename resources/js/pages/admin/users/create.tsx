import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

interface Props { roles: string[] }

const CreateUserPage = ({ roles }: Props) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'editor',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/users');
  };

  return (
    <div className="bg-white px-6 py-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Create User</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full rounded border px-3 py-2" value={data.name} onChange={e => setData('name', e.target.value)} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full rounded border px-3 py-2" value={data.email} onChange={e => setData('email', e.target.value)} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full rounded border px-3 py-2" value={data.password} onChange={e => setData('password', e.target.value)} />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select className="w-full rounded border px-3 py-2" value={data.role} onChange={e => setData('role', e.target.value)}>
            {roles.filter(r => r !== 'admin').map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button disabled={processing} className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Create
          </button>
          <Link href="/admin/users" className="text-sm text-neutral-600 hover:underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

CreateUserPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default CreateUserPage;