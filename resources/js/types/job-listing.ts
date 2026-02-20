// import { PracticeArea } from '@/pages/home-old';
import { LawFirm } from './law-firms';
import { Location } from './locations';
import { PracticeArea } from './practice-area';

export type WorkplaceType = 'onsite' | 'remote' | 'hybrid';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intership';

export interface JobListing {
    id: number;
    title: string;
    slug: string;
    law_firm_id: number | null;
    location_id: number | null;

    workplace_type: WorkplaceType;
    employment_type: EmploymentType;
    experience_level: string | null;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    closing_date: string | null;
    is_active: boolean;
    description: string | null;
    excerpt: string | null;
    external_link: string | null;
    requirements: string[] | null;
    benefits: string[] | null;
    posted_by: number | null;
    // location?: Location;

    published_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface JobListingWithRelations extends JobListing {
    law_firm: LawFirm | null;
    location: Location;
    practice_areas: PracticeArea[];
}

export interface JobListingFormData {
    title: string;
    law_firm_id: string;
    location_id: string;
    workplace_type: WorkplaceType;
    employment_type: EmploymentType;
    experience_level: string;
    salary_min: string;
    salary_max: string;
    salary_currency: 'GBP' | 'USD' | 'EUR';
    closing_date: string;
    is_active: boolean;
    description: string;
    excerpt: string;
    external_link: string;
    requirements: string[];
    benefits: string[];
    practice_areas: number[];
}
