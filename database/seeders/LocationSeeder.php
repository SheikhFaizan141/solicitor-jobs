<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            // England - Major Cities
            ['name' => 'London', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Manchester', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Birmingham', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Leeds', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Liverpool', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Bristol', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Newcastle upon Tyne', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Sheffield', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Nottingham', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Leicester', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Cambridge', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Oxford', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Brighton', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Southampton', 'region' => 'England', 'country' => 'UK'],
            ['name' => 'Reading', 'region' => 'England', 'country' => 'UK'],

            // Scotland
            ['name' => 'Edinburgh', 'region' => 'Scotland', 'country' => 'UK'],
            ['name' => 'Glasgow', 'region' => 'Scotland', 'country' => 'UK'],
            ['name' => 'Aberdeen', 'region' => 'Scotland', 'country' => 'UK'],

            // Wales
            ['name' => 'Cardiff', 'region' => 'Wales', 'country' => 'UK'],
            ['name' => 'Swansea', 'region' => 'Wales', 'country' => 'UK'],

            // Northern Ireland
            ['name' => 'Belfast', 'region' => 'Northern Ireland', 'country' => 'UK'],

            // Remote options
            ['name' => 'Remote (UK)', 'region' => null, 'country' => 'UK', 'is_remote' => true],
            ['name' => 'Remote (Europe)', 'region' => null, 'country' => null, 'is_remote' => true],
            ['name' => 'Remote (Worldwide)', 'region' => null, 'country' => null, 'is_remote' => true],
        ];

        foreach ($locations as $loc) {
            Location::firstOrCreate(
                ['slug' => Str::slug($loc['name'])],
                [
                    'name' => $loc['name'],
                    'region' => $loc['region'] ?? null,
                    'country' => $loc['country'] ?? 'UK',
                    'is_remote' => $loc['is_remote'] ?? false,
                    'is_active' => true,
                    'job_count' => 0,
                ]
            );
        }

        $this->command->info('✓ Created '.count($locations).' locations');
    }
}
