import { FirmCard } from '@/components/law-firms/firm-card';
import { PublicPagination } from '@/components/pagination/public-pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/layouts/main-layout';
import { LawFirm } from '@/types/law-firms';
import { PracticeArea } from '@/types/practice-area';
import { PaginatedResponse } from '@/types/types';
import { queryParams } from '@/wayfinder';
import { Head, router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LawFirmPageProps {
    lawFirms: PaginatedResponse<LawFirm>;
    practiceAreas: PracticeArea[];
    filters: {
        search?: string;
        practice_area?: string;
        sort?: string;
    };
}

const LawFirmPage = ({ lawFirms, practiceAreas, filters }: LawFirmPageProps) => {
    console.log(lawFirms);

    const [search, setSearch] = useState(filters.search || '');
    const [practiceArea, setPracticeArea] = useState(filters.practice_area || 'all');
    const [sort, setSort] = useState(filters.sort || 'latest');

    useEffect(() => {
        setSearch(filters.search || '');
        setPracticeArea(filters.practice_area || 'all');
        setSort(filters.sort || 'latest');
    }, [filters]);

    const buildParams = (overrides: Partial<{ search: string; practice_area: string; sort: string }> = {}) => {
        const params: Record<string, string> = {};

        const finalSearch = overrides.search !== undefined ? overrides.search : search;
        const finalPracticeArea = overrides.practice_area !== undefined ? overrides.practice_area : practiceArea;
        const finalSort = overrides.sort !== undefined ? overrides.sort : sort;

        if (finalSearch.trim()) params.search = finalSearch.trim();
        if (finalPracticeArea && finalPracticeArea !== 'all') params.practice_area = finalPracticeArea;
        if (finalSort && finalSort !== 'latest') params.sort = finalSort;

        return params;
    };

    const handleFilter = () => {
        router.get('/law-firms' + queryParams({ query: buildParams() }), undefined, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClear = () => {
        setSearch('');
        setPracticeArea('all');
        setSort('latest');

        router.get('/law-firms', undefined, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const removeFilter = (filterName: 'search' | 'practice_area' | 'sort') => {
        const overrides: Partial<{ search: string; practice_area: string; sort: string }> = {};

        switch (filterName) {
            case 'search':
                setSearch('');
                overrides.search = '';
                break;
            case 'practice_area':
                setPracticeArea('all');
                overrides.practice_area = 'all';
                break;
            case 'sort':
                setSort('latest');
                overrides.sort = 'latest';
                break;
        }

        router.get('/law-firms' + queryParams({ query: buildParams(overrides) }), undefined, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = !!(search || (practiceArea && practiceArea !== 'all') || (sort && sort !== 'latest'));

    return (
        <>
            <Head title="Law Firms Directory" />
            <article className="mx-auto my-8 max-w-[1200px] p-4">
                <div className="mb-10 border-b border-gray-200 bg-white">
                    <div className="mx-auto max-w-7xl py-12">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Law Firms Directory</h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Browse our comprehensive directory of top-rated law firms. Filter by practice area or location to find the right legal
                                partner for your needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex flex-1 flex-wrap gap-4">
                        {/* Search Input */}
                        <div className="flex min-w-[280px] flex-1 items-center rounded border bg-white px-3 py-2">
                            <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search firms..."
                                className="w-full bg-transparent text-sm outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFilter();
                                }}
                            />
                        </div>

                        {/* Practice Area Select */}
                        <Select value={practiceArea} onValueChange={setPracticeArea}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All practice areas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All practice areas</SelectItem>
                                {practiceAreas.map((area) => (
                                    <SelectItem key={area.id} value={String(area.id)}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort Select */}
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="high">Rating: High to Low</SelectItem>
                                <SelectItem value="low">Rating: Low to High</SelectItem>
                                <SelectItem value="name">Name: A-Z</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Apply Filters Button */}
                        <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleFilter}>
                            Apply Filters
                        </Button>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button type="button" variant="outline" onClick={handleClear} className="gap-1">
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="hidden sm:block">
                        <span className="text-base font-semibold text-gray-800">
                            {lawFirms.total} {lawFirms.total === 1 ? 'Firm' : 'Firms'}
                        </span>
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-gray-600">Active filters:</span>
                        {search && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                                Search: {search}
                                <button
                                    type="button"
                                    onClick={() => removeFilter('search')}
                                    className="hover:text-blue-900"
                                    aria-label="Remove search filter"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {practiceArea && practiceArea !== 'all' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                                {practiceAreas.find((a) => String(a.id) === practiceArea)?.name}
                                <button
                                    type="button"
                                    onClick={() => removeFilter('practice_area')}
                                    className="hover:text-blue-900"
                                    aria-label="Remove practice area filter"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {sort && sort !== 'latest' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                                Sort: {sort === 'high' ? 'High Rating' : sort === 'low' ? 'Low Rating' : 'A-Z'}
                                <button
                                    type="button"
                                    onClick={() => removeFilter('sort')}
                                    className="hover:text-blue-900"
                                    aria-label="Remove sort filter"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Grid Layout */}
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    {lawFirms.data.map((firm) => (
                        <FirmCard key={firm.id} firm={firm} />
                    ))}
                </div>

                {/* Empty State */}
                {lawFirms.data.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No law firms found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                        {hasActiveFilters && (
                            <Button variant="link" onClick={handleClear} className="mt-2 text-blue-600">
                                Clear all filters
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {lawFirms.links && lawFirms.data.length > 0 && (
                    <PublicPagination
                        links={lawFirms.links}
                        currentPage={lawFirms.current_page}
                        totalPages={lawFirms.last_page}
                        totalResults={lawFirms.total}
                    />
                )}
            </article>
        </>
    );
};

LawFirmPage.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default LawFirmPage;
