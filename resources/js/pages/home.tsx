import Layout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const Home = () => {
    const { auth } = usePage<SharedData>().props;

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [practiceArea, setPracticeArea] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Example data for law firms
    const lawFirms = [
        {
            id: 1,
            name: 'Smith & Partners',
            website: 'https://smithpartners.com',
            logo: 'https://via.placeholder.com/80x80/1f2937/ffffff?text=S%26P',
            rating: 4.5,
            reviews: 32,
            jobs: 5,
            location: 'London, UK',
            practiceArea: 'Corporate Law',
            established: 1985,
        },
        {
            id: 2,
            name: 'Johnson Legal',
            website: 'https://johnsonlegal.com',
            logo: 'https://via.placeholder.com/80x80/059669/ffffff?text=JL',
            rating: 4.2,
            reviews: 18,
            jobs: 2,
            location: 'Manchester, UK',
            practiceArea: 'Family Law',
            established: 1998,
        },
        {
            id: 3,
            name: 'Baker Law Group',
            website: 'https://bakerlawgroup.com',
            logo: 'https://via.placeholder.com/80x80/dc2626/ffffff?text=BLG',
            rating: 4.8,
            reviews: 54,
            jobs: 8,
            location: 'Birmingham, UK',
            practiceArea: 'Criminal Law',
            established: 1972,
        },
        {
            id: 4,
            name: 'Wilson & Associates',
            website: 'https://wilsonassociates.com',
            logo: 'https://via.placeholder.com/80x80/7c3aed/ffffff?text=W%26A',
            rating: 4.6,
            reviews: 41,
            jobs: 6,
            location: 'Leeds, UK',
            practiceArea: 'Corporate Law',
            established: 1990,
        },
        {
            id: 5,
            name: 'Taylor Immigration Law',
            website: 'https://taylorimmigration.com',
            logo: 'https://via.placeholder.com/80x80/ea580c/ffffff?text=TIL',
            rating: 4.3,
            reviews: 27,
            jobs: 3,
            location: 'Liverpool, UK',
            practiceArea: 'Immigration Law',
            established: 2005,
        },
        {
            id: 6,
            name: 'Brown Property Solicitors',
            website: 'https://brownproperty.com',
            logo: 'https://via.placeholder.com/80x80/0891b2/ffffff?text=BPS',
            rating: 4.7,
            reviews: 39,
            jobs: 4,
            location: 'Newcastle, UK',
            practiceArea: 'Property Law',
            established: 1988,
        },
    ];

    // Get unique practice areas
    const practiceAreas = [...new Set(lawFirms.map(firm => firm.practiceArea))];

    // Filter and sort firms
    const filteredAndSortedFirms = useMemo(() => {
        let filtered = lawFirms.filter(firm => {
            const matchesSearch = firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                firm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                firm.practiceArea.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPracticeArea = !practiceArea || firm.practiceArea === practiceArea;
            return matchesSearch && matchesPracticeArea;
        });

        // Sort the filtered results
        if (sortBy === 'rating-high') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'rating-low') {
            filtered.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === 'reviews-high') {
            filtered.sort((a, b) => b.reviews - a.reviews);
        } else if (sortBy === 'jobs-high') {
            filtered.sort((a, b) => b.jobs - a.jobs);
        } else if (sortBy === 'established') {
            filtered.sort((a, b) => a.established - b.established);
        }

        return filtered;
    }, [searchTerm, practiceArea, sortBy]);

    // Helper to render stars
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>);
        }
        if (halfStar) {
            stars.push(<span key="half" style={{ color: '#fbbf24' }}>☆</span>);
        }
        while (stars.length < 5) {
            stars.push(<span key={stars.length + 'empty'} style={{ color: '#d1d5db' }}>★</span>);
        }
        return stars;
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <article style={{ maxWidth: 1200, margin: '2rem auto', padding: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>Law Firms Directory</h1>
                
                {/* Filters Section */}
                <div style={{ 
                    background: '#f9fafb', 
                    padding: '1.5rem', 
                    borderRadius: 8, 
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    {/* Search Input */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <input
                            type="text"
                            placeholder="Search law firms, locations, or practice areas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: 6,
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Practice Area Filter */}
                    <div style={{ minWidth: '180px' }}>
                        <select
                            value={practiceArea}
                            onChange={(e) => setPracticeArea(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: 6,
                                fontSize: '0.95rem',
                                background: 'white'
                            }}
                        >
                            <option value="">All Practice Areas</option>
                            {practiceAreas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Filter */}
                    <div style={{ minWidth: '180px' }}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: 6,
                                fontSize: '0.95rem',
                                background: 'white'
                            }}
                        >
                            <option value="">Sort By</option>
                            <option value="rating-high">Rating: High to Low</option>
                            <option value="rating-low">Rating: Low to High</option>
                            <option value="reviews-high">Most Reviews</option>
                            <option value="jobs-high">Most Jobs</option>
                            <option value="established">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.95rem' }}>
                    Showing {filteredAndSortedFirms.length} law firm{filteredAndSortedFirms.length !== 1 ? 's' : ''}
                </div>

                {/* Grid Layout */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    {filteredAndSortedFirms.map(firm => (
                        <div key={firm.id} style={{ 
                            border: '1px solid #e5e7eb', 
                            borderRadius: 8, 
                            padding: '1.5rem', 
                            background: '#fff',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            transition: 'box-shadow 0.2s ease-in-out',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                {/* Logo */}
                                <div style={{ flexShrink: 0 }}>
                                    <img 
                                        src={firm.logo} 
                                        alt={`${firm.name} logo`}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            border: '2px solid #e5e7eb'
                                        }}
                                        onError={(e) => {
                                            // Fallback to initials if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const fallback = target.nextElementSibling as HTMLDivElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback initials */}
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '8px',
                                        background: '#1f2937',
                                        color: 'white',
                                        display: 'none',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        border: '2px solid #e5e7eb'
                                    }}>
                                        {firm.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                                    </div>
                                </div>

                                {/* Firm Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.25rem', margin: 0 }}>{firm.name}</h2>
                                    <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{firm.practiceArea}</div>
                                    
                                    {/* Rating - moved here for better layout */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {renderStars(firm.rating)}
                                        <span style={{ marginLeft: 8, color: '#6b7280', fontSize: '0.9rem' }}>
                                            {firm.rating} ({firm.reviews} reviews)
                                        </span>
                                    </div>
                                </div>

                                {/* Visit Website Button */}
                                <div style={{ flexShrink: 0 }}>
                                    <a 
                                        href={firm.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={{ 
                                            color: '#2563eb', 
                                            textDecoration: 'none', 
                                            fontSize: '0.9rem',
                                            padding: '0.5rem 1rem',
                                            border: '1px solid #2563eb',
                                            borderRadius: 4,
                                            transition: 'all 0.2s',
                                            display: 'inline-block'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#2563eb';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#2563eb';
                                        }}
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>📍 Location:</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{firm.location}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>💼 Jobs:</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{firm.jobs} open positions</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>📅 Established:</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{firm.established}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>⭐ Rating:</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{firm.rating}/5.0</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredAndSortedFirms.length === 0 && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '3rem', 
                        color: '#6b7280',
                        background: '#f9fafb',
                        borderRadius: 8
                    }}>
                        <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No law firms found</div>
                        <div style={{ fontSize: '0.95rem' }}>Try adjusting your search or filter criteria</div>
                    </div>
                )}
            </article>
        </>
    );
}

Home.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default Home;
