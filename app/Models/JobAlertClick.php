<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobAlertClick extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'job_alert_subscription_id',
        'job_listing_id',
        'ip_address',
        'user_agent',
        'clicked_at',
    ];

    protected $casts = [
        'clicked_at' => 'datetime',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(JobAlertSubscription::class, 'job_alert_subscription_id');
    }

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }
}