<?php

namespace App\Models;

use App\Models\Concerns\HasEditLock;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LawFirm extends Model
{
    use HasEditLock, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug', // still fillable so factory/seeder can override if needed
        'website',
        'description',
        'excerpt',
        'is_active',
        'logo_path',
        'locked_by',
        'locked_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'locked_at' => 'datetime',
    ];

    // Add this so logo_url and plain_description are included when model is serialized
    protected $appends = ['logo_url', 'plain_description'];

    // Hide internal storage path when serializing model for responses
    protected $hidden = ['logo_path'];

    /**
     * Automatically create a unique slug when creating (or when slug manually changed).
     */
    protected static function booted(): void
    {
        static::creating(function (LawFirm $firm) {
            // If slug not provided, derive from name.
            if (blank($firm->slug)) {
                $firm->slug = static::generateUniqueSlug($firm->name);
            } else {
                $firm->slug = static::generateUniqueSlug($firm->slug);
            }
        });

        static::updating(function (LawFirm $firm) {
            if ($firm->isDirty('slug')) {
                $firm->slug = static::generateUniqueSlug($firm->slug);
            }
        });
    }

    /**
     * Contacts for the law firm (addresses, emails, phones per label)
     */
    public function contacts()
    {
        return $this->hasMany(LawFirmContact::class);
    }

    /**
     * Plain-text description for use in meta tags, previews, and search snippets.
     * Prefers the editor-curated excerpt; falls back to a stripped version of description.
     */
    protected function plainDescription(): Attribute
    {
        return Attribute::make(
            get: fn (): string => $this->excerpt ?? strip_tags($this->description ?? ''),
        );
    }

    /**
     * Scope to only active (non-hidden) law firms.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * Return public URL for logo when available.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (empty($this->logo_path)) {
            return null;
        }

        // Help static analysis: Storage::disk() returns a FilesystemAdapter which
        // provides the `url()` method. Provide an explicit phpdoc so analyzers
        // understand the type.
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url($this->logo_path);
    }

    /**
     * Generate a unique slug from a base string. Falls back to short id if base collapses.
     */
    protected static function generateUniqueSlug(string $base): string
    {
        $slug = Str::slug($base);

        // If slug empty (e.g., name is only non-latin chars) fallback to a short unique id.
        if ($slug === '') {
            $slug = 'firm-'.Str::lower(Str::random(6));
        }

        $original = $slug;
        $i = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = $original.'-'.$i;
            $i++;

            // Safety: if many collisions, append random suffix and break.
            if ($i > 50) {
                $slug = $original.'-'.Str::lower(Str::random(4));
                break;
            }
        }

        return $slug;
    }

    public function practiceAreas()
    {
        return $this->belongsToMany(PracticeArea::class, 'law_firm_practice_areas');
    }

    /**
     * All reviews for this law firm
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Only active reviews for this law firm
     */
    public function activeReviews()
    {
        return $this->hasMany(Review::class)->active();
    }

    /**
     * Calculate average rating from active reviews
     */
    public function averageRating()
    {
        return $this->activeReviews()->avg('rating') ?? 0;
    }

    /**
     * Get count of active reviews
     */
    public function reviewsCount()
    {
        return $this->activeReviews()->count();
    }

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }

    public function jobs()
    {
        return $this->hasMany(JobListing::class);
    }
}
