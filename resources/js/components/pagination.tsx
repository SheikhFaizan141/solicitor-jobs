import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    currentPage: number;
    perPage: number;
    total: number;
    links: PaginationLink[];
}

export const Pagination = ({ currentPage, perPage, total, links }: PaginationProps) => {
    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, total);

    if (total === 0) {
        return null;
    }

    return (
        <div className="border-t border-gray-200 bg-white px-6 py-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-700">
                    Showing {start}-{end} of {total} results
                </div>

                <nav className="flex items-center space-x-2">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveState={true}
                            preserveScroll={true}
                            className={`rounded-md px-3 py-1 text-sm font-medium ${
                                link.active
                                    ? 'bg-blue-600 text-white'
                                    : link.url
                                      ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                      : 'cursor-not-allowed text-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            </div>
        </div>
    );
};
