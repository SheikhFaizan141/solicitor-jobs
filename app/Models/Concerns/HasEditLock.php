<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Trait for adding pessimistic locking (edit lock) functionality to models.
 *
 * Required columns on the model's table:
 * - locked_by (foreign key to users, nullable)
 * - locked_at (timestamp, nullable)
 *
 * Add these to the model's $fillable array:
 * - 'locked_by'
 * - 'locked_at'
 *
 * Add 'locked_at' => 'datetime' to the model's $casts array.
 */
trait HasEditLock
{
    /**
     * Lock expiry time in minutes.
     */
    protected static int $lockExpiryMinutes = 15;

    /**
     * Get the user who currently has the lock.
     */
    public function lockedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'locked_by');
    }

    /**
     * Check if the model is currently locked by another user.
     */
    public function isLockedByAnotherUser(?User $user): bool
    {
        if (! $this->isLocked()) {
            return false;
        }

        return $this->locked_by !== $user?->id;
    }

    /**
     * Check if the model is currently locked (and lock hasn't expired).
     */
    public function isLocked(): bool
    {
        if (! $this->locked_by || ! $this->locked_at) {
            return false;
        }

        // Lock expires after configured minutes of inactivity
        return $this->locked_at->diffInMinutes(now()) < static::$lockExpiryMinutes;
    }

    /**
     * Acquire a lock for editing.
     */
    public function acquireLock(User $user): bool
    {
        // If locked by another user, fail
        if ($this->isLockedByAnotherUser($user)) {
            return false;
        }

        $this->update([
            'locked_by' => $user->id,
            'locked_at' => now(),
        ]);

        $this->refresh();

        return true;
    }

    /**
     * Release the lock.
     */
    public function releaseLock(?User $user = null): void
    {
        // Only release if the user owns the lock (or no user specified)
        if ($user && $this->locked_by !== $user->id) {
            return;
        }

        $this->update([
            'locked_by' => null,
            'locked_at' => null,
        ]);

        $this->refresh();
    }

    /**
     * Refresh the lock timestamp (heartbeat).
     */
    public function refreshLock(User $user): bool
    {
        if ($this->locked_by !== $user->id) {
            return false;
        }

        $this->update(['locked_at' => now()]);

        $this->refresh();

        return true;
    }
}
