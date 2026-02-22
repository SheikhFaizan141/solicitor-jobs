import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Briefcase, Building2, ChevronRight, FolderOpen, LayoutDashboard, MapPin, MessageSquare, Shield, Tags, Users } from 'lucide-react';
import React, { useState } from 'react';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavItem {
    href: string;
    icon: IconType;
    label: string;
    adminOnly?: boolean;
}

interface NavGroup {
    label: string;
    icon: IconType;
    children: NavItem[];
}

type NavConfig = (NavItem | NavGroup)[];

const isNavGroup = (item: NavItem | NavGroup): item is NavGroup => {
    return 'children' in item;
};

const AdminSidebar: React.FC = () => {
    const { props, url } = usePage<SharedData>();
    const isAdmin = props.auth.user.role === 'admin';

    // Get the current path without query parameters
    const currentPath = url.split('?')[0].replace(/\/$/, '');

    // Check if a given path is active
    const isActive = (href: string): boolean => {
        const normalizedHref = href.replace(/\/$/, '');

        // Exact match
        if (currentPath === normalizedHref) return true;

        // For non-dashboard routes, check if current path starts with href
        if (normalizedHref !== '/admin' && currentPath.startsWith(normalizedHref + '/')) {
            return true;
        }

        return false;
    };

    // Navigation configuration
    const navConfig: NavConfig = [
        {
            href: '/admin',
            icon: LayoutDashboard,
            label: 'Dashboard',
        },
        {
            label: 'Content',
            icon: FolderOpen,
            children: [
                {
                    href: '/admin/law-firms',
                    icon: Building2,
                    label: 'Law Firms',
                },
                {
                    href: '/admin/job-listings',
                    icon: Briefcase,
                    label: 'Job Listings',
                },
                {
                    href: '/admin/practice-areas',
                    icon: Tags,
                    label: 'Practice Areas',
                },
                {
                    href: '/admin/locations',
                    icon: MapPin,
                    label: 'Locations',
                },
            ],
        },
        {
            label: 'Engagement',
            icon: Users,
            children: [
                {
                    href: '/admin/job-alerts',
                    icon: Bell,
                    label: 'Job Alerts',
                },
                {
                    href: '/admin/reviews',
                    icon: MessageSquare,
                    label: 'Reviews',
                },
            ],
        },
        {
            href: '/admin/users',
            icon: Shield,
            label: 'Users',
            adminOnly: true,
        },
    ];

    return (
        <aside className="min-h-screen w-64 bg-gray-900 p-4 text-white">
            <nav className="space-y-1">
                <ul className="m-0 list-none space-y-1 p-0">
                    {navConfig.map((item, index) => {
                        // Skip admin-only items if user is not admin
                        if (!isNavGroup(item) && item.adminOnly && !isAdmin) {
                            return null;
                        }

                        if (isNavGroup(item)) {
                            return <NavGroupItem key={index} group={item} isActive={isActive} />;
                        }

                        return (
                            <li key={index}>
                                <NavLink href={item.href} icon={item.icon} label={item.label} isActive={isActive(item.href)} />
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

function NavGroupItem({ group, isActive }: { group: NavGroup; isActive: (href: string) => boolean }) {
    // Check if any child is active
    const hasActiveChild = group.children.some((child) => isActive(child.href));

    // Keep the section open if any child is active
    const [isOpen, setIsOpen] = useState(hasActiveChild);

    React.useEffect(() => {
        if (hasActiveChild) {
            setIsOpen(true);
        }
    }, [hasActiveChild]);

    return (
        <li>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                className={[
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
                    hasActiveChild ? 'bg-gray-800 text-white' : 'text-gray-200 transition-colors hover:bg-gray-700 hover:text-white',
                ].join(' ')}
            >
                <span className="flex items-center gap-2">
                    <group.icon className="h-4 w-4 opacity-90" />
                    {group.label}
                </span>
                <ChevronRight className={['h-4 w-4 transition-transform', isOpen ? 'rotate-90' : 'rotate-0'].join(' ')} />
            </button>
            {isOpen && (
                <ul className="mt-1 ml-2 space-y-1 border-l border-gray-700 pl-2">
                    {group.children.map((child, index) => (
                        <li key={index}>
                            <NavLink href={child.href} icon={child.icon} label={child.label} isActive={isActive(child.href)} />
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

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
