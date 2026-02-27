import { User } from '.';

export type ReviewStatus = 'active' | 'spam' | 'trashed';

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    status: ReviewStatus;
    created_at: string;
    user: User;
    law_firm: {
        id: number;
        name: string;
    };
}
