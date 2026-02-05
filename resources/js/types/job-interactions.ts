import { JobListingWithRelations } from './job-listing';

export type JobInteractionType = 'saved';
export type JobInteractionStatus = 'active' | 'archived';

export interface UserJobInteraction {
    id: number;
    type: JobInteractionType;
    status: JobInteractionStatus;
    notes: string | null;
    metadata?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    job_listing_id: number;
    job_listing: JobListingWithRelations;
}
