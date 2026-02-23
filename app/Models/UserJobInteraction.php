<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserJobInteraction extends Model
{
    use HasFactory;

    public const TYPE_SAVED = 'saved';

    public const TYPE_APPLIED = 'applied';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_ARCHIVED = 'archived';

    public const APPLICATION_STATUS_APPLIED = 'applied';

    public const APPLICATION_STATUS_INTERVIEW = 'interview';

    public const APPLICATION_STATUS_OFFER = 'offer';

    public const APPLICATION_STATUS_REJECTED = 'rejected';

    public const APPLICATION_STATUS_WITHDRAWN = 'withdrawn';

    /**
     * @return list<string>
     */
    public static function applicationStatuses(): array
    {
        return [
            self::APPLICATION_STATUS_APPLIED,
            self::APPLICATION_STATUS_INTERVIEW,
            self::APPLICATION_STATUS_OFFER,
            self::APPLICATION_STATUS_REJECTED,
            self::APPLICATION_STATUS_WITHDRAWN,
        ];
    }

    public function getApplicationStatusAttribute(): ?string
    {
        return $this->metadata['application_status'] ?? null;
    }

    public function getAppliedAtAttribute(): ?string
    {
        return $this->metadata['applied_at'] ?? null;
    }

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'job_listing_id',
        'type',
        'status',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }
}
