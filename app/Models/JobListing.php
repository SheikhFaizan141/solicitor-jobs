<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class JobListing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'law_firm_id',
        'location_id',
        'workplace_type',
        'employment_type',
        'experience_level',
        'salary_min',
        'salary_max',
        'salary_currency',
        'closing_date',
        'is_active',
        'description',
        'excerpt',
        'external_link',
        'requirements',
        'benefits',
        'posted_by',
        'published_at',
    ];

    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
        'is_active' => 'boolean',
        'closing_date' => 'date',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (JobListing $job) {
            if (blank($job->slug)) {
                $base = Str::slug($job->title);
                $slug = $base;
                $i = 2;
                while (static::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $job->slug = $slug;
            }
        });
    }

    public function lawFirm(): BelongsTo
    {
        return $this->belongsTo(LawFirm::class);
    }

    public function practiceAreas(): BelongsToMany
    {
        return $this->belongsToMany(PracticeArea::class, 'job_listing_practice_areas');
    }

    public function postedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function getFormattedSalaryAttribute(): ?string
    {
        if (! $this->salary_min && ! $this->salary_max) {
            return null;
        }

        $currency = $this->salary_currency === 'GBP' ? '£' : $this->salary_currency;

        if ($this->salary_min && $this->salary_max) {
            return $currency . number_format($this->salary_min) . ' - ' . $currency . number_format($this->salary_max);
        }

        if ($this->salary_min) {
            return 'From ' . $currency . number_format($this->salary_min);
        }

        return 'Up to ' . $currency . number_format($this->salary_max);
    }
}
