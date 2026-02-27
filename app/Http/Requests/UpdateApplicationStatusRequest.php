<?php

namespace App\Http\Requests;

use App\Models\UserJobInteraction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_status' => ['required', 'string', Rule::in(UserJobInteraction::applicationStatuses())],
        ];
    }
}
