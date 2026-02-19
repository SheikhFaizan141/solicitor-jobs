interface Contact {
    label?: string;
    address?: string;
    email?: string;
    phone?: string;
}

interface LawFirmContactsProps {
    contacts: Contact[];
}

export default function LawFirmContacts({ contacts }: LawFirmContactsProps) {
    return (
        <>
            <h3 className="mb-6 text-lg font-bold text-gray-900">Contact Information</h3>
            {(contacts || []).length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                    {contacts.map((c: Contact, i: number) => (
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{c.address}</span>
                                    </div>
                                )}
                                {c.email && (
                                    <div className="flex items-center gap-3">
                                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <a href={`mailto:${c.email}`} className="text-amber-600 hover:text-amber-700 hover:underline">
                                            {c.email}
                                        </a>
                                    </div>
                                )}
                                {c.phone && (
                                    <div className="flex items-center gap-3">
                                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </>
    );
}
