import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Globe2Icon } from 'lucide-react';
import React from 'react';

interface Contact {
    label?: string;
    address?: string;
    email?: string;
    phone?: string;
}

interface Firm {
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    website: string | null;
    description: string | null;
    contacts: Contact[];
}

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: {
        name: string;
    };
}

export default function Show() {
    const { lawFirm } = usePage<SharedData>().props as unknown as { lawFirm: Firm };

    console.log(lawFirm);

    //    console.log(lawFirm);

    // Get tab from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = (urlParams.get('tab') as 'reviews' | 'jobs' | 'contacts') || 'reviews';
    
    const [activeTab, setActiveTab] = React.useState<'reviews' | 'jobs' | 'contacts'>(initialTab);

    // Update URL when tab changes
    React.useEffect(() => {
        const url = new URL(window.location.href);
        if (activeTab !== 'reviews') {
            url.searchParams.set('tab', activeTab);
        } else {
            url.searchParams.delete('tab');
        }
        window.history.replaceState({}, '', url.toString());
    }, [activeTab]);
    return (
        <>
            <Head title={lawFirm?.name ?? 'Listing'} />
               <article className="mx-auto my-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <header className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-6">
                        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            {lawFirm.logo_url ? (
                                <img src={`${lawFirm.logo_url}`} alt={`${lawFirm.name} logo`} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                                    {(lawFirm.name || '')
                                        .split(' ')
                                        .map((w: string) => w[0])
                                        .join('')
                                        .slice(0, 2)}
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{lawFirm.name}</h1>
                            {!lawFirm.website && (
                                <a
                                    // href={lawFirm.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                                >
                                    Visit website
                                    <Globe2Icon className="ml-1 h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Directory
                    </Link>
                </header>

                <div className="grid gap-12">
                    <div className="space-y-12 lg:col-span-2">
                        {/* About Section */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-gray-900">About</h2>
                            <div className="prose prose-gray max-w-none">
                                {lawFirm.description ? (
                                    <p>{lawFirm.description}</p>
                                ) : (
                                    <p className="text-gray-500 italic">No description provided.</p>
                                )}
                            </div>
                        </section>

                        {/* Tabs Section */}
                        <section>
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {['reviews', 'jobs', 'contacts'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as 'reviews' | 'jobs' | 'contacts')}
                                            className={cn(
                                                'border-b-2 px-1 py-4 text-sm font-medium capitalize transition-colors',
                                                activeTab === tab
                                                    ? 'border-amber-500 text-amber-600'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                            )}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="py-8">
                                <div className={cn(activeTab !== 'reviews' && 'hidden')}>
                                    <Reviews lawFirm={lawFirm} />
                                </div>

                                <div className={cn(activeTab !== 'jobs' && 'hidden')}>
                                    <div className="rounded-xl bg-gray-50 py-12 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10a2 2 0 002 2h4a2 2 0 002-2V8"
                                            />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Jobs Available</h3>
                                        <p className="mt-2 text-sm text-gray-500">This law firm hasn't posted any job openings yet.</p>
                                    </div>
                                </div>

                                <div className={cn(activeTab !== 'contacts' && 'hidden')}>
                                    <h3 className="mb-6 text-lg font-bold text-gray-900">Contact Information</h3>
                                    {(lawFirm.contacts || []).length ? (
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            {lawFirm.contacts.map((c: Contact, i: number) => (
                                                <div key={i} className="group relative rounded-xl bg-gray-50 p-6 transition-colors hover:bg-gray-100">
                                                    <h4 className="mb-4 font-semibold text-gray-900">{c.label || 'Office'}</h4>
                                                    <div className="space-y-3 text-sm text-gray-600">
                                                        {c.address && (
                                                            <div className="flex items-start gap-3">
                                                                <svg
                                                                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                </svg>
                                                                <span>{c.address}</span>
                                                            </div>
                                                        )}
                                                        {c.email && (
                                                            <div className="flex items-center gap-3">
                                                                <svg
                                                                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                <a
                                                                    href={`mailto:${c.email}`}
                                                                    className="text-amber-600 hover:text-amber-700 hover:underline"
                                                                >
                                                                    {c.email}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {c.phone && (
                                                            <div className="flex items-center gap-3">
                                                                <svg
                                                                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                    />
                                                                </svg>
                                                                <span>{c.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl bg-gray-50 py-12 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No Contact Information</h3>
                                            <p className="mt-2 text-sm text-gray-500">Contact details are not available for this law firm.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* <div className="lg:col-span-1">
                        Sidebar content can go here
                    </div> */}
                </div>
            </article>
        </>
    );
}

function Reviews({ lawFirm }: { lawFirm: Firm }) {
    const {
        auth,
        reviews,
        totalReviews = 0,
        averageRating = 0,
    } = usePage<SharedData>().props as unknown as {
        auth: SharedData['auth'];
        reviews: { data: Review[] };
        totalReviews: number;
        averageRating: number;
    };

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
                        starValue <= rating ? 'text-amber-400' : 'text-gray-200',
                        interactive &&
                            'cursor-pointer rounded hover:text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 focus:outline-none',
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
        <div className="space-y-12">
            {/* Review Form */}
            {auth.user ? (
                <div className="rounded-xl bg-gray-50 p-8">
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Write a Review</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-3 block text-sm font-medium text-gray-700">Rating *</label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">{renderStars(data.rating, true, (rating) => setData('rating', rating))}</div>
                                <span className="text-sm font-medium text-gray-500">({data.rating}/5)</span>
                            </div>
                            {errors.rating && <p className="mt-2 text-sm text-red-600">{errors.rating}</p>}
                        </div>

                        <div>
                            {/* <label htmlFor="comment" className="mb-3 block text-sm font-medium text-gray-700">
                                Comment (optional)
                            </label> */}
                            <Label htmlFor="comment" className="mb-3 block text-sm font-medium text-gray-700">
                                Comment (optional)
                            </Label>
                            <Textarea
                                id="comment"
                                rows={4}
                                className="block w-full resize-none rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                placeholder="Share your experience with this law firm..."
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                maxLength={1000}
                            ></Textarea>
                            <div className="mt-2 flex justify-between">
                                {errors.comment && <p className="text-sm text-red-600">{errors.comment}</p>}
                                <p className="ml-auto text-xs text-gray-500">{data.comment.length}/1000</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="rounded-xl bg-gray-50 p-12 text-center">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">Login Required</h3>
                    <p className="mb-8 text-gray-500">Please log in to write a review for this law firm</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                        Log In
                    </Link>
                </div>
            )}

            {/* Reviews List */}
            <div>
                <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-8">
                    <h3 className="text-xl font-bold text-gray-900">
                        Reviews {totalReviews > 0 && <span className="ml-2 text-base font-normal text-gray-500">({totalReviews})</span>}
                    </h3>
                    {averageRating > 0 && totalReviews > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="flex text-amber-400">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-sm font-medium text-gray-900">{Number(averageRating).toFixed(1)} out of 5</span>
                        </div>
                    )}
                </div>

                {reviews?.data?.length > 0 ? (
                    <div className="space-y-10">
                        {reviews.data.map((review: Review) => (
                            <div key={review.id} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                                        {review.user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900">{review.user.name}</h4>
                                        <time className="text-sm text-gray-500">{formatDate(review.created_at)}</time>
                                    </div>
                                    <div className="flex text-sm text-amber-400">{renderStars(review.rating)}</div>
                                    {review.comment && (
                                        <div className="prose prose-sm max-w-none text-gray-600">
                                            <p>{review.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-gray-500">Be the first to review this law firm!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Remove the unused ReviewForm component since it's integrated into Reviews

Show.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;
