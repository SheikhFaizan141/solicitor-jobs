<?php

namespace App\Mail;

use App\Models\JobAlertSubscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobAlertDigestMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public JobAlertSubscription $subscription, public $jobs)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->subscription->frequency === 'daily' ? 'Your Daily Job Alerts' : 'Your Weekly Job Alerts';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {

        // dd( 'jobs', $this->jobs, 'subscription', $this->subscription );

        return new Content(
            markdown: 'emails.job_alert_digest',
            with: [
                'subscription' => $this->subscription,
                'jobs' => $this->jobs,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
