export interface Location {
    id: number;
    name: string;
    slug: string;
    region: string | null;
    country: string;
    is_remote: boolean;
    job_listings_count?: number;

    created_at: string;
    updated_at: string;
}