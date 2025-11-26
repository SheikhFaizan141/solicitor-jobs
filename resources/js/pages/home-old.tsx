import { FirmCard } from '@/components/law-firms/firm-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
// import { type SharedData } from '@/types';
// import { Head, usePage } from '@inertiajs/react';
export type PracticeArea = {
    id: number;
    name: string;
};

export type Firm = {
    id: number;
    name: string;
    slug: string;
    website: string;
    logo_url: string;
    rating: number;
    reviews: number;
    jobs: number;
    location: string;
    practice_areas: PracticeArea[];
    established: number;
};

// Helper to render stars
const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <span key={i} style={{ color: '#fbbf24' }}>
                ★
            </span>,
        );
    }
    if (halfStar) {
        stars.push(
            <span key="half" style={{ color: '#fbbf24' }}>
                ☆
            </span>,
        );
    }
    while (stars.length < 5) {
        stars.push(
            <span key={stars.length + 'empty'} style={{ color: '#d1d5db' }}>
                ★
            </span>,
        );
    }
    return stars;
};

const Home = () => {
    const { lawFirms, practiceAreas } = usePage<SharedData>().props;

    const {
        data,
        setData: setFilters,
        get,
        reset,
        processing,
    } = useForm({
        search: '',
        practice_area: '',
        sort: '',
    });

    console.log(data);

    const handleFilter = () => {
        // get(router('home'), { preserveState: true, replace: true });
        get('/', { preserveState: true, replace: true });
    };

    const handleClear = () => {
        setFilters({ search: '', practice_area: '', sort: '' });
        get('/', {
            data: { search: '', practice_area: '', sort: '' },
            preserveState: true,
            replace: true,
        });
    };
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <article className="mx-auto my-8 max-w-[1200px] p-4">
                <h1 className="mb-8 text-4xl font-semibold">Law Firms Directory</h1>

                {/* Filters Section */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex flex-1 gap-x-4">
                        {/* Search Component */}
                        <div className="flex items-center rounded border bg-white px-2 py-1 lg:min-w-80">
                            <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search firms..."
                                className="w-full bg-transparent text-sm outline-none"
                                onChange={(e) => setFilters({ ...data, search: e.target.value })}
                                value={data.search}
                            />
                        </div>

                        <div>
                            <Select onValueChange={(value) => setFilters({ ...data, practice_area: value })} value={String(data.practice_area)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All practice areas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {practiceAreas.map((area: PracticeArea) => (
                                        <SelectItem key={area.id} value={String(area.id)}>
                                            {area.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Select onValueChange={(value) => setFilters({ ...data, sort: value })} value={String(data.sort)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">Highest First</SelectItem>
                                    <SelectItem value="low">Lowest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Apply button */}
                        <Button
                            type="button"
                            className="ml-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            onClick={handleFilter}
                            disabled={processing}
                        >
                            Apply Filters
                        </Button>

                        <Button
                            type="button"
                            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            aria-label="Clear filters"
                            onClick={handleClear}
                        >
                            <X />
                        </Button>
                    </div>

                    <div className="">
                        <span className="text-base font-semibold text-gray-800">353 Companies</span>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    {lawFirms.data.map((firm) => (
                        <FirmCard key={firm.id} firm={firm} />
                    ))}
                </div>

                {/* Pagination */}
                {lawFirms.links && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex space-x-1">
                            {lawFirms.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    className={`rounded border px-3 py-2 text-sm ${
                                        link.active
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </>
    );
};

Home.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default Home;
