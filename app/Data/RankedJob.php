<?php

namespace App\Data;

use App\Models\JobListing;

class RankedJob
{
    /**
     * @param list<string> $reasonCodes
     * @param list<string> $reasonLabels
     */
    public function __construct(
        public JobListing $job,
        public float $score,
        public array $reasonCodes,
        public array $reasonLabels,
    ) {}
}
