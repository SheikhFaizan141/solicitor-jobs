<?php

return [
    'enabled' => env('SMART_ALERTS_ENABLED', true),
    'max_jobs_per_digest' => (int) env('SMART_ALERTS_MAX_JOBS_PER_DIGEST', 12),
    'rollout_percentage' => (int) env('SMART_ALERTS_ROLLOUT_PERCENTAGE', 100),
    'attribution_window_days' => (int) env('SMART_ALERTS_ATTRIBUTION_WINDOW_DAYS', 7),
    'click_link_ttl_days' => (int) env('SMART_ALERTS_CLICK_TTL_DAYS', 30),
];
