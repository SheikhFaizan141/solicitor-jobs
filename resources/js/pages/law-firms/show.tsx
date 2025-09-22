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
            <article className="mx-auto my-8 h-dvh w-full max-w-7xl">
                <header className="flex items-start gap-4">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-gray-100">
                        {lawFirm.logo_url ? (
                            <img src={`${lawFirm.logo_url}`} alt={`${lawFirm.name} logo`} className="h-16 w-16 object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                                {(lawFirm.name || '')
                                    .split(' ')
                                    .map((w: string) => w[0])
                                    .join('')
                                    .slice(0, 2)}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl leading-relaxed font-bold">{lawFirm.name}</h1>
                        {lawFirm.website && (
                            <a href={lawFirm.website} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-800 underline">
                                Visit website
                            </a>
                        )}
                    </div>

                    <div className="ml-auto">
                        <Link href="/" className="text-sm text-blue-600 hover:underline">
                            Back
                        </Link>
                    </div>
                </header>

                <section className="mt-6">
                    <h2 className="text-lg font-medium">About</h2>
                    <p className="mt-2 text-sm">{lawFirm.description ?? <em>No description provided.</em>}</p>
                </section>

                <section className="mt-6"></section>

                {/* Tabs */}
                <section className="mt-6">
                    <div id="tabs" className="">
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`border-b-2 px-4 py-2 text-sm font-medium ${activeTab === 'reviews' ? 'border-amber-600 text-amber-600' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`border-b-2 px-4 py-2 text-sm font-medium ${activeTab === 'jobs' ? 'border-amber-600 text-amber-600' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Jobs
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`border-b-2 px-4 py-2 text-sm font-medium ${activeTab === 'contacts' ? 'border-amber-600 text-amber-600' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Contacts
                        </button>
                    </div>

                    <div className={cn('mt-4', activeTab !== 'reviews' && 'hidden')}>
                        <Reviews lawFirm={lawFirm} />
                    </div>

                    <div className={cn('mt-4', activeTab !== 'jobs' && 'hidden')}>
                        <p className="text-sm text-muted-foreground">No jobs posted yet.</p>
                    </div>

                    <div className={cn('mt-4', activeTab !== 'contacts' && 'hidden')}>
                        <h2 className="text-lg font-medium">Contacts</h2>
                        {(lawFirm.contacts || []).length ? (
                            <ul className="mt-2 space-y-2">
                                {lawFirm.contacts.map((c: any, i: number) => (
                                    <li key={i} className="rounded border p-3">
                                        <div className="font-medium">{c.label || 'Office'}</div>
                                        {c.address && <div className="text-sm">{c.address}</div>}
                                        {c.email && (
                                            <div className="text-sm text-amber-800">
                                                <a href={`mailto:${c.email}`}>{c.email}</a>
                                            </div>
                                        )}
                                        {c.phone && <div className="text-sm">{c.phone}</div>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 text-sm text-muted-foreground">No contacts available.</p>
                        )}
                    </div>
                </section>
            </article>
        </>
    );
}

function Reviews({ lawFirm }: { lawFirm: Firm }) {
    const { auth } = usePage<SharedData>().props;

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

    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
                <button
                    key={index}
                    type={interactive ? 'button' : undefined}
                    className={`text-2xl ${
                        starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } ${interactive ? 'cursor-pointer transition-colors hover:text-yellow-400' : ''}`}
                    onClick={interactive && onRatingChange ? () => onRatingChange(starValue) : undefined}
                    disabled={!interactive}
                >
                    ★
                </button>
            );
        });
    };

    return (
        <div className="mt-4">
            {/* Review Form */}
            {auth.user ? (
                <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-4 text-lg font-medium">Write a Review</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Rating *</label>
                            <div className="flex items-center gap-1">
                                {renderStars(data.rating, true, (rating) => setData('rating', rating))}
                                <span className="ml-2 text-sm text-gray-600">({data.rating}/5)</span>
                            </div>
                            {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
                        </div>

                        <div>
                            <label htmlFor="comment" className="mb-2 block text-sm font-medium">
                                Comment (optional)
                            </label>
                            <textarea
                                id="comment"
                                rows={4}
                                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                placeholder="Share your experience with this law firm..."
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                maxLength={1000}
                            />
                            <div className="mt-1 flex justify-between">
                                {errors.comment && <p className="text-sm text-red-600">{errors.comment}</p>}
                                <p className="ml-auto text-xs text-gray-500">{data.comment.length}/1000</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-amber-600 px-6 py-2 text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                    <p className="mb-4 text-gray-600">Please log in to write a review</p>
                    <Link href="/login" className="inline-block rounded-md bg-amber-600 px-6 py-2 text-white transition-colors hover:bg-amber-700">
                        Log In
                    </Link>
                </div>
            )}

            {/* Reviews List */}
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;
