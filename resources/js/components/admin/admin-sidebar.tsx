import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Briefcase, Building2, ChevronRight, LayoutDashboard, MessageSquare, Tags, Users } from 'lucide-react';
import React, { useState } from 'react';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const AdminSidebar: React.FC = () => {
    const { props, url } = usePage<SharedData>();

    console.log(props.auth.user.role);

    const current = url || '';
    const isActive = (href: string) => current === href || current.startsWith(href + '/');

    const [lawFirmsOpen, setLawFirmsOpen] = useState(true);

    return (
        <aside className="min-h-screen w-64 bg-gray-900 p-4 text-white">
            <nav className="space-y-1">
                <ul className="m-0 list-none space-y-1 p-0">
                    {/* Dashboard */}
                    <li>
                        <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" isActive={isActive('/admin/dashboard')} />
                    </li>

                    {/* Law Firms (collapsible group) */}
                    <li>
                        <button
                            type="button"
                            onClick={() => setLawFirmsOpen((o) => !o)}
                            aria-expanded={lawFirmsOpen}
                            className={[
                                'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
                                'text-gray-200 transition-colors hover:bg-gray-700 hover:text-white',
                            ].join(' ')}
                        >
                            <span className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 opacity-90" />
                                Law Firms
                            </span>
                            <ChevronRight className={['h-4 w-4 transition-transform', lawFirmsOpen ? 'rotate-90' : 'rotate-0'].join(' ')} />
                        </button>
                        {lawFirmsOpen && (
                            <ul className="mt-1 ml-2 space-y-1 border-l border-gray-700 pl-2">
                                <li>
                                    <NavLink href="/admin/law-firms" icon={Building2} label="All Law Firms" isActive={isActive('/admin/law-firms')} />
                                </li>
                                <li>
                                    <NavLink
                                        href="/admin/practice-areas"
                                        icon={Tags}
                                        label="Practice Areas"
                                        isActive={isActive('/admin/practice-areas')}
                                    />
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Jobs */}
                    <li>
                        <NavLink href="/admin/job-listings" icon={Briefcase} label="Job Listings" isActive={isActive('/admin/job-listings')} />
                    </li>

                    {/* Reviews */}
                    <li>
                        <NavLink href="/admin/reviews" icon={MessageSquare} label="Reviews" isActive={isActive('/admin/reviews')} />
                    </li>

                    {/* Cases */}
                    <li>
                        <NavLink href="/admin/users" icon={Users} label="Users" isActive={isActive('/admin/users')} />
                    </li>

                    {/* Logout */}
                    {/* <li className="pt-2">
                        <NavLink href="/logout" icon={LogOut} label="Logout" isActive={false} className="text-red-300 hover:text-white" />
                    </li> */}
                </ul>
            </nav>
        </aside>
    );
};

function NavLink({
    href,
    icon: Icon,
    label,
    isActive,
    className = '',
}: {
    href: string;
    icon: IconType;
    label: string;
    isActive: boolean;
    className?: string;
}) {
    return (
        <Link
            href={href}
            className={[
                'group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-700 hover:text-white',
                className,
            ].join(' ')}
        >
            <Icon className="h-4 w-4 opacity-90 group-hover:opacity-100" />
            <span>{label}</span>
        </Link>
    );
}

export default AdminSidebar;
