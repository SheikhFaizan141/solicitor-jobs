import { Location } from './locations';
import { PracticeArea } from './practice-area';

export interface LawFirm {
    id: number;
    name: string;
    slug: string;
    website: string;
    logo_url: string | null;
    description: string;
    email: string;
    location: string;
    phone: string;
    is_active?: boolean;
    average_rating: number;
    // reviews_count: number;
    jobs_count: number;

    contacts?: Contact[];

    locations?: Location[];
    practice_areas?: PracticeArea[];

    created_at: string;
    updated_at: string;
}

// export interface LawFirm {
//     id: number;
//     name: string;
//     slug: string;
//     description: string | null;
//     website: string | null;
//     logo_url: string | null;

//     created_at: string;
//     updated_at: string;
// }

export interface Contact {
    label: string;
    address: string;
    email?: string;
    phone?: string;
}
