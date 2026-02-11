import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

type NumberedPaginationLink = PaginationLink & { pageNumber: number };

interface PublicPaginationProps {
    links: PaginationLink[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
}

export const PublicPagination = ({ links, currentPage, totalPages, totalResults }: PublicPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    // Extract prev/next URLs
    const prevLink = links.find((l) => l.label.includes('Previous'));
    const nextLink = links.find((l) => l.label.includes('Next'));

    // Get page number links (exclude prev/next)
    const pageLinks = links.filter((l) => !l.label.includes('Previous') && !l.label.includes('Next'));

    const numberedPageLinks: NumberedPaginationLink[] = pageLinks
        .map((link) => {
            const pageNumber = extractPageNumber(link.label);
            if (pageNumber === null) {
                return null;
            }

            return {
                ...link,
                pageNumber,
            } satisfies NumberedPaginationLink;
        })
        .filter((link): link is NumberedPaginationLink => link !== null);

    const numberedPageMap = new Map<number, NumberedPaginationLink>();
    numberedPageLinks.forEach((link) => {
        numberedPageMap.set(link.pageNumber, link);
    });

    const mobileDisplayItems = buildMobileDisplayItems({
        currentPage,
        totalPages,
        numberedPageMap,
    });

    return (
        <nav
            className="mt-8 flex flex-col items-center gap-4 border-t border-gray-200 py-6 sm:mt-12 sm:gap-6 sm:py-8"
            aria-label="Pagination navigation"
        >
            {/* Results summary */}
            <div className="px-4 text-center text-xs text-gray-600 sm:text-sm">
                Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span> · Total{' '}
                <span className="font-semibold text-gray-900">{totalResults.toLocaleString()}</span> results
            </div>

            {/* Page buttons */}
            <div className="w-full px-4 sm:px-0">
                <div className="flex flex-col gap-2">
                    {/* Mobile condensed window */}
                    <div className="flex items-center justify-center gap-1 sm:hidden">
                        {renderNavButton({
                            link: prevLink,
                            icon: <ChevronLeft className="h-3.5 w-3.5" />,
                            ariaLabel: 'Previous page',
                            className:
                                'flex flex-shrink-0 items-center rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600',
                            disabledClassName:
                                'flex flex-shrink-0 items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-400',
                            label: 'Previous',
                            showLabel: false,
                        })}

                        <div className="flex items-center gap-0.5">
                            {mobileDisplayItems.map((item) => {
                                if (item.type === 'ellipsis') {
                                    return (
                                        <span key={item.key} className="px-1 text-gray-400" aria-hidden="true">
                                            …
                                        </span>
                                    );
                                }

                                const isActive = item.page === currentPage;
                                const pageLink = item.link;
                                const key = `mobile-page-${item.page}`;

                                if (isActive) {
                                    return (
                                        <span
                                            key={key}
                                            className="inline-flex flex-shrink-0 items-center justify-center rounded-lg bg-amber-600 px-2 py-1.5 text-xs font-semibold text-white"
                                            aria-current="page"
                                        >
                                            {item.page}
                                        </span>
                                    );
                                }

                                if (pageLink?.url) {
                                    return (
                                        <Link
                                            key={key}
                                            href={pageLink.url}
                                            preserveState={true}
                                            preserveScroll={true}
                                            className="inline-flex flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                        >
                                            {item.page}
                                        </Link>
                                    );
                                }

                                return (
                                    <span
                                        key={key}
                                        className="inline-flex flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-400"
                                    >
                                        {item.page}
                                    </span>
                                );
                            })}
                        </div>

                        {renderNavButton({
                            link: nextLink,
                            icon: <ChevronRight className="h-3.5 w-3.5" />,
                            ariaLabel: 'Next page',
                            className:
                                'flex flex-shrink-0 items-center rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600',
                            disabledClassName:
                                'flex flex-shrink-0 items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-400',
                            label: 'Next',
                            showLabel: false,
                        })}
                    </div>

                    {/* Desktop full pagination */}
                    <div className="hidden items-center justify-center gap-2 sm:flex">
                        {renderNavButton({
                            link: prevLink,
                            icon: <ChevronLeft className="h-4 w-4" />,
                            ariaLabel: 'Previous page',
                            className:
                                'inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600',
                            disabledClassName:
                                'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400',
                            label: 'Previous',
                            showLabel: true,
                        })}

                        <div className="flex items-center gap-1">
                            {pageLinks.map((link, index) => {
                                if (link.label === '...') {
                                    return (
                                        <span key={`desktop-ellipsis-${index}`} className="px-1 text-gray-400" aria-hidden="true">
                                            {link.label}
                                        </span>
                                    );
                                }

                                if (link.active) {
                                    return (
                                        <span
                                            key={`desktop-page-${index}`}
                                            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white"
                                            aria-current="page"
                                        >
                                            {stripHtml(link.label)}
                                        </span>
                                    );
                                }

                                if (link.url) {
                                    return (
                                        <Link
                                            key={`desktop-page-${index}`}
                                            href={link.url}
                                            preserveState={true}
                                            preserveScroll={true}
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    );
                                }

                                return (
                                    <span
                                        key={`desktop-page-${index}`}
                                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400"
                                    >
                                        {stripHtml(link.label)}
                                    </span>
                                );
                            })}
                        </div>

                        {renderNavButton({
                            link: nextLink,
                            icon: <ChevronRight className="h-4 w-4" />,
                            ariaLabel: 'Next page',
                            className:
                                'inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600',
                            disabledClassName:
                                'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400',
                            label: 'Next',
                            showLabel: true,
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const stripHtml = (label: string): string => label.replace(/<[^>]*>/g, '').trim();

const extractPageNumber = (label: string): number | null => {
    const numericPart = stripHtml(label).replace(/[^0-9]/g, '');
    if (!numericPart) {
        return null;
    }

    const parsed = Number(numericPart);
    return Number.isNaN(parsed) ? null : parsed;
};

const buildMobileDisplayItems = ({
    currentPage,
    totalPages,
    numberedPageMap,
}: {
    currentPage: number;
    totalPages: number;
    numberedPageMap: Map<number, NumberedPaginationLink>;
}) => {
    if (totalPages <= 5) {
        return createDisplayItems(
            Array.from({ length: totalPages }, (_, index) => index + 1),
            numberedPageMap,
        );
    }

    const importantPages = new Set<number>([1, totalPages, currentPage]);

    const windowRadius = 1;
    for (let offset = -windowRadius; offset <= windowRadius; offset += 1) {
        const page = currentPage + offset;
        if (page >= 1 && page <= totalPages) {
            importantPages.add(page);
        }
    }

    if (currentPage <= 3) {
        for (let page = 2; page <= 4 && page < totalPages; page += 1) {
            importantPages.add(page);
        }
    }

    if (currentPage >= totalPages - 2) {
        for (let page = totalPages - 3; page <= totalPages - 1; page += 1) {
            if (page > 1) {
                importantPages.add(page);
            }
        }
    }

    const sortedPages = Array.from(importantPages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b);

    return createDisplayItems(sortedPages, numberedPageMap);
};

const createDisplayItems = (pages: number[], numberedPageMap: Map<number, NumberedPaginationLink>) => {
    const items: Array<{ type: 'page'; page: number; link?: NumberedPaginationLink } | { type: 'ellipsis'; key: string }> = [];
    let previousPage: number | undefined;

    pages.forEach((page) => {
        if (previousPage !== undefined && page - previousPage > 1) {
            items.push({ type: 'ellipsis', key: `ellipsis-${previousPage}-${page}` });
        }

        items.push({ type: 'page', page, link: numberedPageMap.get(page) });
        previousPage = page;
    });

    return items;
};

const renderNavButton = ({
    link,
    icon,
    ariaLabel,
    className,
    disabledClassName,
    label,
    showLabel,
}: {
    link: PaginationLink | undefined;
    icon: ReactNode;
    ariaLabel: string;
    className: string;
    disabledClassName: string;
    label: string;
    showLabel: boolean;
}) => {
    if (link && link.url) {
        return (
            <Link href={link.url} preserveState={true} preserveScroll={true} className={className} aria-label={ariaLabel}>
                {label === 'Previous' && icon}
                {showLabel && <span>{label}</span>}
                {label === 'Next' && icon}
            </Link>
        );
    }

    return (
        <button type="button" disabled className={disabledClassName} aria-label={`${ariaLabel} (disabled)`}>
            {label === 'Previous' && icon}
            {showLabel && <span>{label}</span>}
            {label === 'Next' && icon}
        </button>
    );
};
