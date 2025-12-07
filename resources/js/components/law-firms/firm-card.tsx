import { Firm } from '@/pages/law-firms/index';
import { Link } from '@inertiajs/react';
import { Briefcase, Building2, MapPin, Star } from 'lucide-react';

interface FirmCardProps {
    firm: Firm;
}

export function FirmCard({ firm }: FirmCardProps) {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${
                        i < fullStars
                            ? 'fill-amber-400 text-amber-400'
                            : i === fullStars && hasHalfStar
                              ? 'fill-amber-200 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                    }`}
                />,
            );
        }
        return stars;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    console.log(firm);
    
    return (
        <div className="group relative rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <Link href={`/law-firms/${firm.slug}`} className="absolute inset-0 z-0" aria-label={`View ${firm.name} profile`} />

            <div className="relative z-10 flex gap-4">
                {/* Logo */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
                    {firm.logo_url ? (
                        <img src={firm.logo_url} alt={`${firm.name} logo`} className="h-full w-full object-contain" />
                    ) : (
                        <span className="text-lg font-semibold text-gray-600">{getInitials(firm.name)}</span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600">{firm.name}</h3>

                    {/* Rating */}
                    {firm.average_rating > 0 && (
                        <div className="mt-1 flex items-center gap-2">
                            <div className="flex gap-0.5">{renderStars(firm.average_rating)}</div>
                            <span className="text-sm text-gray-600">
                                {/* {firm.average_rating.toFixed(1)} ({firm.reviews_count} reviews) */}
                            </span>
                        </div>
                    )}

                    {/* Location */}
                    {firm.location && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{firm.location}</span>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        {firm.practice_areas && firm.practice_areas.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Building2 className="h-4 w-4" />
                                <span>{firm.practice_areas.length} practice areas</span>
                            </div>
                        )}
                        {firm.jobs_count > 0 && (
                            <Link
                                href={`/law-firms/${firm.slug}?tab=jobs`}
                                className="relative z-20 flex items-center gap-1.5 transition-colors hover:text-amber-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Briefcase className="h-4 w-4" />
                                <span className="underline decoration-dotted underline-offset-2">
                                    {firm.jobs_count} {firm.jobs_count === 1 ? 'job' : 'jobs'}
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Practice Areas Tags */}
                    {firm.practice_areas && firm.practice_areas.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {firm.practice_areas.slice(0, 3).map((area) => (
                                <span
                                    key={area.id}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                                >
                                    {area.name}
                                </span>
                            ))}
                            {firm.practice_areas.length > 3 && (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                    +{firm.practice_areas.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
