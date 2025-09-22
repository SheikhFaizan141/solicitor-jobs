import Layout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Firm } from '../home';

export default function Show() {
    const { lawFirm } = usePage<SharedData>().props as { lawFirm: Firm };

    console.log(lawFirm);

    const [activeTab, setActiveTab] = React.useState<'reviews' | 'jobs' | 'contacts'>('reviews');

    return (
        <>
            <Head title={lawFirm?.name ?? 'Listing'} />
            <article className="mx-auto my-8 h-dvh w-full max-w-7xl p-4">
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
                        <Reviews />
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

function Reviews() {
    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium">Reviews</h2>
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;
