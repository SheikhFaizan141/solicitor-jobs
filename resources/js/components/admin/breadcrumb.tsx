import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="mb-6 flex items-center text-sm text-gray-600">
            <Link href="/admin" className="hover:text-gray-900 transition-colors">
                Admin
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="mx-2 h-4 w-4" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-gray-900 transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
