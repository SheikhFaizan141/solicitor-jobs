@component('mail::message')
{{-- Header --}}
# 🎯 Your Job Alert Digest

Hello {{ $subscription->user->name }},

We found {{ count($jobs) }} new {{ $subscription->frequency === 'daily' ? 'daily' : 'weekly' }} job{{ count($jobs) !== 1 ? 's' : '' }} that match your preferences.

{{-- Jobs Section --}}
@if(count($jobs) > 0)
## Featured Opportunities

@foreach($jobs as $job)
@component('mail::panel')
**{{ $job->title }}**  
{{ $job->lawFirm?->name ?? 'Independent Practice' }}

@if($job->location)
📍 {{ $job->location }}
@endif

@if($job->employment_type)
💼 {{ ucwords(str_replace('_', ' ', $job->employment_type)) }}
@endif

@if($job->salary_min || $job->salary_max)
💰 @if($job->salary_min && $job->salary_max)
£{{ number_format($job->salary_min) }} - £{{ number_format($job->salary_max) }}
@elseif($job->salary_min)
From £{{ number_format($job->salary_min) }}
@else
Up to £{{ number_format($job->salary_max) }}
@endif
@endif

@if($job->practiceAreas && $job->practiceAreas->count() > 0)
🏛️ {{ $job->practiceAreas->pluck('name')->join(', ') }}
@endif

@component('mail::button', ['url' => url('/jobs/'.$job->slug), 'color' => 'primary'])
View Job Details
@endcomponent
@endcomponent

@endforeach

{{-- Summary Stats --}}
---

📊 **Your Alert Summary:**
- Frequency: {{ ucfirst($subscription->frequency) }}
- Employment Types: {{ $subscription->employment_types ? implode(', ', array_map(fn($type) => ucwords(str_replace('_', ' ', $type)), $subscription->employment_types)) : 'All types' }}
- Location: {{ $subscription->location ?: 'All locations' }}
- Practice Areas: {{ $subscription->practice_area_ids && count($subscription->practice_area_ids) > 0 ? 'Specific areas selected' : 'All practice areas' }}

@else
@component('mail::panel')
👀 **No new jobs this time**

We didn't find any new positions matching your current preferences since your last digest. Don't worry - we're continuously monitoring for opportunities that fit your criteria.

Consider broadening your search criteria to discover more opportunities!
@endcomponent
@endif

{{-- Action Buttons --}}
@component('mail::button', ['url' => url('/job-alerts'), 'color' => 'success'])
Manage Job Alerts
@endcomponent

@component('mail::button', ['url' => url('/jobs'), 'color' => 'secondary'])
Browse All Jobs
@endcomponent

{{-- Footer Information --}}
---

**Need help?** Reply to this email or visit our [help center]({{ url('/help') }}).

**Want to change how often you receive these emails?** [Update your preferences]({{ url('/job-alerts') }}) or [unsubscribe]({{ url('/job-alerts/unsubscribe/'.$subscription->id) }}).

Best regards,  
The {{ config('app.name') }} Team

@slot('subcopy')
This email was sent to {{ $subscription->user->email }} because you have an active job alert subscription. If you no longer wish to receive these emails, you can [unsubscribe here]({{ url('/job-alerts/unsubscribe/'.$subscription->id) }}).
@endslot

@endcomponent