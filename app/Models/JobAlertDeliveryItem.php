<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobAlertDeliveryItem extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'job_alert_subscription_id',
        'user_id',
        'job_listing_id',
        'delivered_at',
        'rank_position',
        'score',
        'reason_codes',
        'is_personalized',
        'clicked_at',
        'applied_at',
    ];

    protected $casts = [
        'delivered_at' => 'datetime',
        'clicked_at' => 'datetime',
        'applied_at' => 'datetime',
        'score' => 'float',
        'reason_codes' => 'array',
        'is_personalized' => 'boolean',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(JobAlertSubscription::class, 'job_alert_subscription_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }
}
