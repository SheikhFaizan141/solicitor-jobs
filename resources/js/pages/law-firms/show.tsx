import Layout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { Firm } from '../home';

export default function Show() {
    const { lawFirm } = usePage<SharedData>().props as { lawFirm: Firm };

    console.log(lawFirm);

    const [activeTab, setActiveTab] = React.useState<'reviews' | 'jobs' | 'contacts'>('reviews');

    return (
        <>
            <Head title={lawFirm?.name ?? 'Listing'} />
            <article className="mx-auto my-8 w-full max-w-7xl px-4">
                {/* Header Section */}
                <header className="mb-8 flex items-start gap-6 rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
                        {lawFirm.logo_url ? (
                            <img src={`${lawFirm.logo_url}`} alt={`${lawFirm.name} logo`} className="h-20 w-20 object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-600">
                                {(lawFirm.name || '')
                                    .split(' ')
                                    .map((w: string) => w[0])
                                    .join('')
                                    .slice(0, 2)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">{lawFirm.name}</h1>
                        {lawFirm.website && (
                            <a 
                                href={lawFirm.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-800"
                            >
                                Visit website
                                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>

                    <div className="flex-shrink-0">
                        <Link 
                            href="/" 
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Directory
                        </Link>
                    </div>
                </header>

                {/* About Section */}
                <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">About</h2>
                    <div className="prose prose-sm max-w-none text-gray-700">
                        {lawFirm.description ? (
                            <p>{lawFirm.description}</p>
                        ) : (
                            <p className="italic text-gray-500">No description provided.</p>
                        )}
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="rounded-lg border bg-white shadow-sm">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={cn(
                                    'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                    activeTab === 'reviews'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={cn(
                                    'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                    activeTab === 'jobs'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                Jobs
                            </button>
                            <button
                                onClick={() => setActiveTab('contacts')}
                                className={cn(
                                    'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                    activeTab === 'contacts'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                Contacts
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        <div className={cn(activeTab !== 'reviews' && 'hidden')}>
                            <Reviews lawFirm={lawFirm} />
                        </div>

                        <div className={cn(activeTab !== 'jobs' && 'hidden')}>
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10a2 2 0 002 2h4a2 2 0 002-2V8" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No Jobs Available</h3>
                                <p className="mt-2 text-sm text-gray-500">This law firm hasn't posted any job openings yet.</p>
                            </div>
                        </div>

                        <div className={cn(activeTab !== 'contacts' && 'hidden')}>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h3>
                            {(lawFirm.contacts || []).length ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {lawFirm.contacts.map((c: any, i: number) => (
                                        <div key={i} className="rounded-lg border border-gray-200 p-4">
                                            <h4 className="mb-3 font-medium text-gray-900">{c.label || 'Office'}</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                {c.address && (
                                                    <div className="flex items-start gap-2">
                                                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{c.address}</span>
                                                    </div>
                                                )}
                                                {c.email && (
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <a href={`mailto:${c.email}`} className="text-amber-700 hover:text-amber-800 hover:underline">
                                                            {c.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {c.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <span>{c.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Contact Information</h3>
                                    <p className="mt-2 text-sm text-gray-500">Contact details are not available for this law firm.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </article>
        </>
    );
}

function Reviews({ lawFirm }: { lawFirm: Firm }) {
    const { auth, reviews, totalReviews = 1, averageRating = 2 } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        comment: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(lawFirm);

        if (!auth.user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        post(`/law-firms/${lawFirm.slug}/reviews`, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
                <button
                    key={index}
                    type={interactive ? 'button' : undefined}
                    className={cn(
                        'text-xl transition-colors',
                        starValue <= rating ? 'text-yellow-400' : 'text-gray-300',
                        interactive && 'cursor-pointer hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 rounded'
                    )}
                    onClick={interactive && onRatingChange ? () => onRatingChange(starValue) : undefined}
                    disabled={!interactive}
                    aria-label={interactive ? `Rate ${starValue} stars` : `${starValue} star rating`}
                >
                    ★
                </button>
            );
        });
    };

    return (
        <div className="space-y-8">
            {/* Review Form */}
            {auth.user ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Write a Review</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-3 block text-sm font-medium text-gray-700">Rating *</label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {renderStars(data.rating, true, (rating) => setData('rating', rating))}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-600">({data.rating}/5)</span>
                            </div>
                            {errors.rating && <p className="mt-2 text-sm text-red-600">{errors.rating}</p>}
                        </div>

                        <div>
                            <label htmlFor="comment" className="mb-3 block text-sm font-medium text-gray-700">
                                Comment (optional)
                            </label>
                            <textarea
                                id="comment"
                                rows={4}
                                className="block w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                placeholder="Share your experience with this law firm..."
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                maxLength={1000}
                            />
                            <div className="mt-2 flex justify-between">
                                {errors.comment && <p className="text-sm text-red-600">{errors.comment}</p>}
                                <p className="ml-auto text-xs text-gray-500">{data.comment.length}/1000</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">Login Required</h3>
                    <p className="mb-6 text-gray-600">Please log in to write a review for this law firm</p>
                    <Link 
                        href="/login" 
                        className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        Log In
                    </Link>
                </div>
            )}

            {/* Reviews List */}
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Reviews {totalReviews > 0 && <span className="text-gray-500">({totalReviews})</span>}
                    </h3>
                    {averageRating && totalReviews > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-sm font-medium text-gray-600">
                                {averageRating.toFixed(1)} out of 5
                            </span>
                        </div>
                    )}
                </div>

                {reviews?.data?.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.data.map((review) => (
                            <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex">{renderStars(review.rating)}</div>
                                        <div>
                                            <span className="font-medium text-gray-900">{review.user.name}</span>
                                            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                {review.comment && (
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500">Be the first to review this law firm!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Remove the unused ReviewForm component since it's integrated into Reviews

Show.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;