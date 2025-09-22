import { Firm } from '@/pages/home';
import { Link } from '@inertiajs/react';

export function FirmCard({ firm }: { firm: Firm }) {
    const practiceAreasCount = firm.practice_areas.length;
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
                <div className="flex-shrink-0 flex flex-col items-end gap-y-5">
                    <Link
                        href={`/law-firms/${(firm as any).slug ?? firm.id}`}
                        className="inline-block rounded border border-orange-700 px-4 py-2 text-sm text-orange-600 no-underline transition-all duration-200 hover:bg-orange-600 hover:text-white"
                    >
                        View listing
                    </Link>

                    {/* PracticeAreas */}
                    <div className="mt-2">
                        {practiceAreasCount > 0 ? (
                            <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-blue-800">
                                {firm['practice_areas'][0].name}
                            </span>
                        ) : null}

                        {practiceAreasCount > 1 ? (
                            <span className="ml-1 inline-block rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-blue-800">
                                +{practiceAreasCount - 1}
                            </span>
                        ) : null}
                    </div>
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
