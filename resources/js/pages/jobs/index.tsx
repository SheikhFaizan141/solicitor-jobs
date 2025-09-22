import Layout from '@/layouts/main-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Job {
    id: number;
    title: string;
    lawFirm: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    salary: string;
    experience: string;
    practiceAreas: string[];
    description: string;
    postedDate: string;
    applications: number;
}

const dummyJobs: Job[] = [
    {
        id: 1,
        title: 'Senior Corporate Lawyer',
        lawFirm: 'Smith & Associates Law Firm',
        location: 'London, UK',
        type: 'Full-time',
        salary: '£80,000 - £120,000',
        experience: '5+ years',
        practiceAreas: ['Corporate Law', 'M&A', 'Securities'],
        description: 'We are seeking an experienced corporate lawyer to join our growing team. The successful candidate will handle complex M&A transactions and provide strategic legal advice to our corporate clients.',
        postedDate: '2 days ago',
        applications: 12
    },
    {
        id: 2,
        title: 'Family Law Solicitor',
        lawFirm: 'Johnson Legal Services',
        location: 'Manchester, UK',
        type: 'Full-time',
        salary: '£45,000 - £65,000',
        experience: '2-4 years',
        practiceAreas: ['Family Law', 'Divorce', 'Child Custody'],
        description: 'Join our compassionate family law team helping clients through challenging times. Experience in divorce proceedings and child custody matters preferred.',
        postedDate: '1 week ago',
        applications: 8
    },
    {
        id: 3,
        title: 'Criminal Defense Attorney',
        lawFirm: 'Williams & Partners',
        location: 'Birmingham, UK',
        type: 'Full-time',
        salary: '£55,000 - £75,000',
        experience: '3+ years',
        practiceAreas: ['Criminal Law', 'Defense', 'Court Representation'],
        description: 'Experienced criminal defense attorney needed to represent clients in various criminal matters. Court experience and strong advocacy skills required.',
        postedDate: '3 days ago',
        applications: 15
    },
    {
        id: 4,
        title: 'Commercial Property Lawyer',
        lawFirm: 'Thompson Legal Group',
        location: 'Leeds, UK',
        type: 'Full-time',
        salary: '£60,000 - £85,000',
        experience: '4+ years',
        practiceAreas: ['Property Law', 'Commercial Real Estate', 'Conveyancing'],
        description: 'Handle commercial property transactions, leases, and development projects. Strong attention to detail and client relationship skills essential.',
        postedDate: '5 days ago',
        applications: 6
    },
    {
        id: 5,
        title: 'Junior Immigration Lawyer',
        lawFirm: 'Global Immigration Partners',
        location: 'Remote',
        type: 'Full-time',
        salary: '£35,000 - £45,000',
        experience: '1-2 years',
        practiceAreas: ['Immigration Law', 'Visa Applications', 'Asylum'],
        description: 'Entry-level position for a motivated lawyer to join our immigration practice. Training provided for visa applications and asylum cases.',
        postedDate: '1 day ago',
        applications: 23
    },
    {
        id: 6,
        title: 'Intellectual Property Counsel',
        lawFirm: 'Tech Legal Solutions',
        location: 'Edinburgh, UK',
        type: 'Contract',
        salary: '£500 - £700/day',
        experience: '6+ years',
        practiceAreas: ['IP Law', 'Patents', 'Trademarks'],
        description: '6-month contract position for an IP specialist to work on high-profile technology patents and trademark registrations.',
        postedDate: '4 days ago',
        applications: 9
    }
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const experienceLevels = ['All', '1-2 years', '2-4 years', '3+ years', '4+ years', '5+ years', '6+ years'];
const locations = ['All', 'London, UK', 'Manchester, UK', 'Birmingham, UK', 'Leeds, UK', 'Edinburgh, UK', 'Remote'];

export default function JobsIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedExperience, setSelectedExperience] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');

    const filteredJobs = dummyJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.lawFirm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.practiceAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = selectedType === 'All' || job.type === selectedType;
        const matchesExperience = selectedExperience === 'All' || job.experience === selectedExperience;
        const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;

        return matchesSearch && matchesType && matchesExperience && matchesLocation;
    });

    return (
        <>
            <Head title="Legal Jobs" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Find Your Perfect Legal Career
                            </h1>
                            <p className="mt-4 text-xl text-gray-600">
                                Discover opportunities at top law firms across the UK
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>
                                
                                {/* Search */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Job title, law firm, practice area..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                {/* Job Type */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Type
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Experience Level */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience Level
                                    </label>
                                    <select
                                        value={selectedExperience}
                                        onChange={(e) => setSelectedExperience(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        {experienceLevels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        {locations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedType('All');
                                        setSelectedExperience('All');
                                        setSelectedLocation('All');
                                    }}
                                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>

                        {/* Job Listings */}
                        <div className="lg:w-3/4">
                            {/* Results Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                                </h2>
                                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                                    <option>Most Recent</option>
                                    <option>Salary: High to Low</option>
                                    <option>Salary: Low to High</option>
                                    <option>Most Applications</option>
                                </select>
                            </div>

                            {/* Job Cards */}
                            <div className="space-y-6">
                                {filteredJobs.map(job => (
                                    <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 hover:text-amber-600 cursor-pointer">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-lg text-amber-600 font-medium mt-1">
                                                        {job.lawFirm}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                        {job.type}
                                                    </span>
                                                    <p className="text-sm text-gray-500 mt-1">{job.postedDate}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                    {job.salary}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                    </svg>
                                                    {job.experience}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {job.practiceAreas.map(area => (
                                                        <span key={area} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {job.description}
                                            </p>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                    </svg>
                                                    {job.applications} applications
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                                                        Save Job
                                                    </button>
                                                    <button className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors">
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {filteredJobs.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                            Previous
                                        </button>
                                        <button className="px-3 py-2 text-sm font-medium text-white bg-amber-600 border border-amber-600 rounded-md">
                                            1
                                        </button>
                                        <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                            2
                                        </button>
                                        <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                            3
                                        </button>
                                        <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            )}

                            {/* No Results */}
                            {filteredJobs.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Try adjusting your search filters to find more results.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

JobsIndex.layout = (page: React.ReactElement) => <Layout>{page}</Layout>;
