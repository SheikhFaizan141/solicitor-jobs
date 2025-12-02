import { Location } from './locations';
import { PracticeArea } from './practice-area';

export interface LawFirm {
    id: number;
    name: string;
    slug: string;
    website: string;
    description: string;
    email: string;
    location: string;
    phone: string;
    is_active?: boolean;

    locations?: Location[];
    practice_areas?: PracticeArea[];

    created_at: string;
    updated_at: string;
}
