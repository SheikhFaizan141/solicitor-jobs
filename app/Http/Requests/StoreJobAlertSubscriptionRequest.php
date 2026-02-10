<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobAlertSubscriptionRequest extends FormRequest
{
    private const MAX_ACTIVE_ALERTS = 5;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'frequency' => ['required', Rule::in(['daily', 'weekly'])],
            'employment_types' => ['nullable', 'array'],
            'employment_types.*' => [Rule::in(['full_time', 'part_time', 'contract', 'internship'])],
            'practice_area_ids' => ['nullable', 'array'],
            'practice_area_ids.*' => ['integer', Rule::exists('practice_areas', 'id')],
            'location_id' => ['nullable', 'integer', Rule::exists('locations', 'id')],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $user = $this->user();

            if (! $user) {
                return;
            }

            $activeCount = $user->jobAlertSubscriptions()
                ->where('is_active', true)
                ->count();

            if ($activeCount >= self::MAX_ACTIVE_ALERTS) {
                $validator->errors()->add('limit', 'You can only have up to '.self::MAX_ACTIVE_ALERTS.' active job alerts.');
            }
        });
    }
}
