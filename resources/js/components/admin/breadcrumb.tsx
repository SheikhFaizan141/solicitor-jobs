import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { type FC } from 'react';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="mb-6 flex items-center text-sm text-gray-600">
            <Link href="/admin" className="transition-colors hover:text-gray-900">
                Admin
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="mx-2 h-4 w-4" />
                    {item.href ? (
                        <Link href={item.href} className="transition-colors hover:text-gray-900">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-gray-900">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
