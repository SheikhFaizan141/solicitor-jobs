<x-mail::message>
# Your Job Alert Digest

Hello {{ $subscription->user->name }},

We found {{ count($jobs) }} new {{ $subscription->frequency === 'daily' ? 'daily' : 'weekly' }}
job{{ count($jobs) !== 1 ? 's' : '' }} that match your preferences.

@foreach ($jobs as $entry)
@php
    $job = $entry['job'];
    $locationName = null;
    $locationCountry = null;

    if (is_string($job->location)) {
        $locationName = $job->location;
    } elseif (is_object($job->location) || is_array($job->location)) {
        $locationName = $job->location->name ?? $job->location['name'] ?? null;
        $locationCountry = $job->location->country ?? $job->location['country'] ?? null;
    }
@endphp

<x-mail::panel>
### #{{ $entry['rank_position'] }} {{ $job->title }}

@if (!empty($entry['reason_labels']))
**Why this job:** {{ implode(' • ', $entry['reason_labels']) }}

@endif

@if ($locationName)
**Location:** {{ $locationName }}@if ($locationCountry), {{ $locationCountry }}@endif
@if (optional($job->location)->is_remote)
 • Remote
@endif

@endif

**Posted:** {{ optional($job->published_at ?? $job->created_at)->format('F j, Y') }}

@if ($job->salary_min || $job->salary_max)
**Salary:**
@if ($job->salary_min && $job->salary_max)
£{{ number_format($job->salary_min) }} – £{{ number_format($job->salary_max) }}
@elseif ($job->salary_min)
From £{{ number_format($job->salary_min) }}
@else
Up to £{{ number_format($job->salary_max) }}
@endif

@endif

{{ \Illuminate\Support\Str::limit(strip_tags($job->description), 140) }}

<x-mail::button :url="$entry['click_url']">
View Job
</x-mail::button>
</x-mail::panel>
@endforeach

<x-mail::button :url="url('/jobs')">
Browse All Jobs
</x-mail::button>

Thanks,
{{ config('app.name') }}
</x-mail::message>
