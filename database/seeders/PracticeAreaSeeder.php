<?php

namespace Database\Seeders;

use App\Models\PracticeArea;
use Illuminate\Database\Seeder;

class PracticeAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $practiceAreas = [
            'Corporate Law',
            'Family Law',
            'Criminal Law',
            'Employment Law',
            'Immigration Law',
            'Personal Injury',
            'Real Estate Law',
            'Intellectual Property',
            'Tax Law',
            'Commercial Litigation',
            'Banking & Finance',
            'Mergers & Acquisitions',
            'Environmental Law',
            'Healthcare Law',
            'Insurance Law',
            'Construction Law',
            'Media & Entertainment',
            'Sports Law',
            'Data Protection',
            'Human Rights',
        ];

        foreach ($practiceAreas as $area) {
            PracticeArea::create(['name' => $area]);
        }

        $this->command->info('Created ' . count($practiceAreas) . ' practice areas');
    }
}