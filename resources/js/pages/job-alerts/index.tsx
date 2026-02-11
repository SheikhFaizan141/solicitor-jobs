import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/layouts/main-layout';
import { destroy } from '@/routes/job-alerts';
import { Location } from '@/types/locations';
import { Head, router, useForm } from '@inertiajs/react';
import React from 'react';

type Subscription = {
    id: number;
    frequency: 'daily' | 'weekly';
    employment_types: string[] | null;
    practice_areas: PracticeArea[];
    location_id: number | null;
    location: Location | null;
    is_active: boolean;
};

type PracticeArea = { id: number; name: string };

interface JobAlertsPageProps {
    subscriptions: Subscription[];
    filterOptions: {
        employment_types: string[];
        practice_areas: PracticeArea[];
        locations: Location[];
    };
    [key: string]: unknown;
}

export default function JobAlertsIndex({ subscriptions = [], filterOptions }: JobAlertsPageProps) {
    // const { subscriptions = [], filterOptions } = usePage<JobAlertsPageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        frequency: 'daily' as 'daily' | 'weekly',
        employment_types: [] as string[],
        practice_area_ids: [] as number[],
        location_id: null as number | null,
    });
    const limitError = (errors as Record<string, string | undefined>).limit;
    const maxActiveAlerts = 5;
    const activeAlertCount = subscriptions.filter((subscription) => subscription.is_active).length;
    const isLimitReached = activeAlertCount >= maxActiveAlerts;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLimitReached) {
            return;
        }
        post('/job-alerts', {
            preserveScroll: true,
            onSuccess: () => reset('practice_area_ids', 'employment_types', 'location_id'),
        });
    };

    const toggleType = (type: string) => {
        const set = new Set(data.employment_types);
        if (set.has(type)) {
            set.delete(type);
        } else {
            set.add(type);
        }
        setData('employment_types', Array.from(set));
    };

    const toggleArea = (id: number) => {
        const set = new Set(data.practice_area_ids);
        if (set.has(id)) {
            set.delete(id);
        } else {
            set.add(id);
        }
        setData('practice_area_ids', Array.from(set));
    };

    const getLocationDisplay = (location: Location): string => {
        const parts = [location.name];
        if (location.region) parts.push(location.region);
        if (location.is_remote) parts.push('(Remote)');
        return parts.join(', ');
    };

    return (
        <>
            <Head title="Job Alerts" />
            <div className="mx-auto max-w-3xl px-4 py-6">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Create Job Alert</h1>
                <form onSubmit={submit} className="space-y-4 rounded border bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                        <span>
                            Active alerts: {activeAlertCount} / {maxActiveAlerts}
                        </span>
                        {isLimitReached && <span className="font-medium text-amber-700">You have reached the maximum.</span>}
                    </div>
                    {limitError && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{limitError}</p>}
                    <div>
                        <label className="block text-sm font-medium">Frequency</label>
                        <div className="mt-2 flex gap-4">
                            {(['daily', 'weekly'] as const).map((f) => (
                                <label key={f} className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={f}
                                        checked={data.frequency === f}
                                        onChange={() => setData('frequency', f)}
                                    />
                                    <span className="capitalize">{f}</span>
                                </label>
                            ))}
                        </div>
                        {errors.frequency && <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Employment Types</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {filterOptions.employment_types.map((t: string) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => toggleType(t)}
                                    className={`rounded px-3 py-1 text-sm capitalize ${
                                        data.employment_types.includes(t) ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        {errors.employment_types && <p className="mt-1 text-sm text-red-600">{errors.employment_types}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Practice Areas</label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {filterOptions.practice_areas.map((pa: PracticeArea) => (
                                <label key={pa.id} className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={data.practice_area_ids.includes(pa.id)} onChange={() => toggleArea(pa.id)} />
                                    {pa.name}
                                </label>
                            ))}
                        </div>
                        {errors.practice_area_ids && <p className="mt-1 text-sm text-red-600">{errors.practice_area_ids}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Location</label>
                        <Select
                            value={data.location_id?.toString() || 'all'}
                            onValueChange={(value) => setData('location_id', value === 'all' ? null : parseInt(value))}
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {filterOptions.locations.map((location: Location) => (
                                    <SelectItem key={location.id} value={location.id.toString()}>
                                        {getLocationDisplay(location)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.location_id && <p className="mt-1 text-sm text-red-600">{errors.location_id}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || isLimitReached}
                        className={`rounded px-4 py-2 font-medium text-white ${
                            processing || isLimitReached ? 'cursor-not-allowed bg-amber-300' : 'bg-amber-600'
                        }`}
                    >
                        {isLimitReached ? 'Max alerts reached' : processing ? 'Saving...' : 'Create Alert'}
                    </button>
                </form>

                <div className="mt-8">
                    <h2 className="mb-3 text-xl font-semibold text-gray-900">My Subscriptions</h2>
                    <div className="space-y-2">
                        {(subscriptions as Subscription[]).map((s) => (
                            <div key={s.id} className="flex items-center justify-between rounded border bg-white p-3">
                                <div className="text-sm text-gray-700">
                                    <div className="font-medium capitalize">{s.frequency} digest</div>
                                    <div className="text-gray-500">
                                        {s.location ? getLocationDisplay(s.location) : 'Any location'} • types:{' '}
                                        {(s.employment_types || []).join(', ') || 'Any'} • areas: {s.practice_areas.length || 'Any'}
                                    </div>
                                </div>
                                <button
                                    className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                                    onClick={() => router.delete(destroy(s.id))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {!subscriptions.length && <p className="text-sm text-gray-500">No subscriptions yet.</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

JobAlertsIndex.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;
