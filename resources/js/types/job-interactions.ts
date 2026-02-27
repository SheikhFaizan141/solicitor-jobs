import { JobListingWithRelations } from './job-listing';

export type JobInteractionType = 'saved' | 'applied';
export type JobInteractionStatus = 'active' | 'archived';
export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface ApplicationMetadata {
    application_status: ApplicationStatus;
    applied_at: string;
    [key: string]: unknown;
}

export interface UserJobInteraction {
    id: number;
    type: JobInteractionType;
    status: JobInteractionStatus;
    notes: string | null;
    metadata?: ApplicationMetadata | null;
    created_at: string;
    updated_at: string;
    job_listing_id: number;
    job_listing: JobListingWithRelations;
}
