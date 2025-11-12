export interface Location {
    id: number;
    name: string;
    slug: string;
    region: string;
    country: string;

    // check these fields
    job_listings_count: number;
    created_at: string;
}
