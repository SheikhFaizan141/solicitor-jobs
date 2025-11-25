// import { Location } from './types';

export type WorkplaceType = 'onsite' | 'remote' | 'hybrid';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intership';

export interface LawFirm {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    website: string | null;
    logo_url: string | null;

    created_at: string;
    updated_at: string;
}

export interface JobListing {
    id: number;
    title: string;
    slug: string;
    law_firm_id: number | null;
    location_id: number | null;

    location: string | null;
    workplace_type: WorkplaceType;
    employment_type: EmploymentType;
    experience_level: string | null;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    closing_date: string | null;
    is_active: boolean;
    description: string | null;
    requirements: string[] | null;
    benefits: string[] | null;
    posted_by: number | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    law_firm: LawFirm | null;
    // location?: Location;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
