import AdminLayout from '@/layouts/admin-layout';
import { LawFirm } from '@/types/law-firms';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

interface LawFirmShowProps {
    lawFirm: LawFirm;
}

const LawFirmShow: React.FC<LawFirmShowProps> & {
    layout?: (page: React.ReactNode) => React.ReactNode;
} = ({ lawFirm }) => {
    const breadcrumbs = [
        { label: 'Law Firms', href: '/admin/law-firms' },
        { label: lawFirm.name },
    ];

    return (
        <>
            <Head title={`${lawFirm.name} - Law Firm Details`} />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="mb-6 -mx-6 -mt-6 bg-white px-6 py-3 border-b border-gray-200 flex items-center text-sm">
                    <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Dashboard
                    </Link>
                    {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            {item.href ? (
                                <Link href={item.href} className="text-blue-600 hover:text-blue-700 transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-medium">{item.label}</span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <Link href="/admin/law-firms" className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Law Firms
                        </Link>
                        <div className="flex items-center gap-4">
                            {lawFirm.logo_path && (
                                <img
                                    src={`/storage/${lawFirm.logo_path}`}
                                    alt={lawFirm.name}
                                    className="h-16 w-16 rounded-lg object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{lawFirm.name}</h1>
                                <p className="mt-1 text-sm text-gray-600">{lawFirm.slug}</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        href={`/admin/law-firms/${lawFirm.id}/edit`}
                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Edit
                    </Link>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Description */}
                        {lawFirm.description && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">About</h2>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: lawFirm.description }}
                                />
                            </div>
                        )}

                        {/* Practice Areas */}
                        {lawFirm.practice_areas && lawFirm.practice_areas.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Practice Areas</h2>
                                <div className="flex flex-wrap gap-2">
                                    {lawFirm.practice_areas.map((area) => (
                                        <span
                                            key={area.id}
                                            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                        >
                                            {area.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contacts */}
                        {lawFirm.contacts && lawFirm.contacts.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h2>
                                <div className="space-y-4">
                                    {lawFirm.contacts.map((contact, index) => (
                                        <div key={index} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                                            {contact.label && <h3 className="mb-2 font-medium text-gray-900">{contact.label}</h3>}
                                            <div className="space-y-2 text-sm text-gray-600">
                                                {contact.address && (
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                        <span>{contact.address}</span>
                                                    </div>
                                                )}
                                                {contact.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700">
                                                            {contact.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {contact.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-700">
                                                            {contact.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Details</h2>
                            <dl className="space-y-3 divide-y divide-gray-200">
                                <div className="flex justify-between py-2">
                                    <dt className="text-sm font-medium text-gray-600">Created</dt>
                                    <dd className="text-sm text-gray-900">
                                        {new Date(lawFirm.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-sm font-medium text-gray-600">Updated</dt>
                                    <dd className="text-sm text-gray-900">
                                        {new Date(lawFirm.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </dd>
                                </div>
                                {lawFirm.website && (
                                    <div className="flex justify-between py-2">
                                        <dt className="text-sm font-medium text-gray-600">Website</dt>
                                        <dd className="text-sm">
                                            <a
                                                href={lawFirm.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <Globe className="h-4 w-4" />
                                                Visit
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Actions */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Actions</h2>
                            <div className="space-y-2">
                                <Link
                                    href={`/admin/law-firms/${lawFirm.id}/edit`}
                                    className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Edit Firm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

LawFirmShow.layout = (page: React.ReactNode) => {
    const { lawFirm } = (page as React.ReactElement<{ lawFirm: { id: number; name: string } }>).props;

    return (
        <AdminLayout
            breadcrumbs={[
                { label: 'Law Firms', href: '/admin/law-firms' },
                { label: lawFirm?.name ?? 'Law Firm' },
            ]}
        >
            {page}
        </AdminLayout>
    );
};

export default LawFirmShow;
