<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LawFirm extends Model
{
    protected $fillable = [
        'name',
        'slug', // still fillable so factory/seeder can override if needed
        'description',
        'email',
        'location',
        'phone',
        // 'logo_path',
    ];

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
     * Generate a unique slug from a base string. Falls back to short id if base collapses.
     */
    protected static function generateUniqueSlug(string $base): string
    {
        $slug = Str::slug($base);

        // If slug empty (e.g., name is only non-latin chars) fallback to a short unique id.
        if ($slug === '') {
            $slug = 'firm-' . Str::lower(Str::random(6));
        }

        $original = $slug;
        $i = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = $original . '-' . $i;
            $i++;
            
            // Safety: if many collisions, append random suffix and break.
            if ($i > 50) {
                $slug = $original . '-' . Str::lower(Str::random(4));
                break;
            }
        }

        return $slug;
    }
}
