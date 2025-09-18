import Layout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
// import { type SharedData } from '@/types';
// import { Head, usePage } from '@inertiajs/react';

type Firm = {
    id: number;
    name: string;
    website: string;
    logo_url: string;
    rating: number;
    reviews: number;
    jobs: number;
    location: string;
    practiceArea: string;
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
    const { lawFirms } = usePage<SharedData>().props;

    console.log(lawFirms.data);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <article className="mx-auto my-8 max-w-[1200px] p-4">
                <h1 className="mb-8 text-4xl font-semibold">Law Firms Directory</h1>

                {/* Filters Section */}
                <div>filter section</div>

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
                                    className={`px-3 py-2 text-sm border rounded ${
                                        link.active
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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

function FirmCard({ firm }: { firm: Firm }) {
    return (
        <div
            key={firm.id}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white p-6 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg"
        >
            {/* Header */}
            <div className="mb-4 flex items-start gap-4">
                {/* Logo */}
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100">
                    <img
                        src={firm.logo_url}
                        alt={`${firm.name} logo`}
                        className="block h-16 w-16 object-contain"
                        onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = 'flex';
                        }}
                    />
                    {/* Fallback initials */}
                    <div className="hidden h-16 w-16 items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-800 text-xl font-semibold text-white">
                        {firm.name
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)}
                    </div>
                </div>

                {/* Firm Info */}
                <div className="min-w-0 flex-1">
                    <h2 className="m-0 mb-1 text-xl font-medium">{firm.name}</h2>
                    <a
                        href={firm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-2 text-sm text-amber-800 underline underline-offset-2"
                    >
                        Visit Website
                    </a>
                </div>

                {/* Visit Website Button */}
                <div className="flex-shrink-0">
                    <a
                        href={firm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded border border-blue-600 px-4 py-2 text-sm text-red-600 no-underline transition-all duration-200 hover:bg-blue-600 hover:text-white"
                    >
                        Visit Website
                    </a>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
                {/* <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">📍 Location:</span>
                    <span className="text-sm font-medium">{firm.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">💼 Jobs:</span>
                    <span className="text-sm font-medium">{firm.jobs} open positions</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">📅 Established:</span>
                    <span className="text-sm font-medium">{firm.established}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">⭐ Rating:</span>
                    <span className="text-sm font-medium">{firm.rating}/5.0</span>
                </div> */}
            </div>
        </div>
    );
}

Home.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default Home;
