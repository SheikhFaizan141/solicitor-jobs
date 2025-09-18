<?php

namespace Database\Seeders;

use App\Models\LawFirm;
use App\Models\LawFirmContact;
use App\Models\PracticeArea;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class LawFirmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('en_GB');

        // Create practice areas first if they don't exist
        $this->createPracticeAreas();

        // Get all practice areas for random assignment
        $practiceAreas = PracticeArea::all();

        // UK cities and regions for realistic locations
        $ukLocations = [
            'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 
            'Bradford', 'Liverpool', 'Edinburgh', 'Bristol', 'Cardiff', 'Leicester',
            'Coventry', 'Belfast', 'Nottingham', 'Newcastle', 'Brighton', 'Hull',
            'Plymouth', 'Stoke-on-Trent', 'Wolverhampton', 'Derby', 'Swansea',
            'Southampton', 'Salford', 'Aberdeen', 'Westminster', 'Portsmouth',
            'York', 'Peterborough', 'Dundee', 'Lancaster', 'Oxford', 'Cambridge',
            'Canterbury', 'Winchester', 'Bath', 'Chester', 'Exeter', 'Norwich'
        ];

        // Common UK law firm name patterns
        $firmNames = [
            'Partners', 'Associates', 'Legal', 'Solicitors', 'Barristers', 'Law',
            '& Co', 'LLP', 'Legal Services', 'Chambers', 'Legal Partners'
        ];

        $surnames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
            'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
            'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
            'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
            'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
            'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
            'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
            'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz',
            'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
            'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan',
            'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos',
            'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez',
            'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
            'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long',
            'Ross', 'Foster', 'Jimenez'
        ];

        // Description templates based on practice areas
        $descriptionTemplates = [
            'corporate' => [
                'Leading corporate law specialists providing comprehensive business legal services.',
                'Expert corporate lawyers serving businesses of all sizes across the UK.',
                'Trusted corporate legal advisors with decades of combined experience.',
                'Full-service corporate law firm specializing in mergers, acquisitions, and business formations.',
                'Corporate law experts helping businesses navigate complex legal challenges.'
            ],
            'family' => [
                'Compassionate family law solicitors providing expert guidance during difficult times.',
                'Experienced family lawyers specializing in divorce, custody, and matrimonial matters.',
                'Dedicated family law practitioners committed to protecting your interests.',
                'Specialist family law firm offering sensitive and professional legal support.',
                'Expert family solicitors handling all aspects of family and matrimonial law.'
            ],
            'criminal' => [
                'Experienced criminal defense lawyers providing robust legal representation.',
                'Leading criminal law specialists defending clients across all courts.',
                'Expert criminal solicitors with a proven track record of successful defenses.',
                'Dedicated criminal law firm providing 24/7 legal representation.',
                'Specialist criminal defense lawyers committed to protecting your rights.'
            ],
            'property' => [
                'Property law specialists providing comprehensive real estate legal services.',
                'Expert conveyancing solicitors making property transactions smooth and secure.',
                'Leading property lawyers handling residential and commercial real estate matters.',
                'Experienced property law firm specializing in conveyancing and property disputes.',
                'Trusted property solicitors providing expert legal guidance for all property matters.'
            ],
            'personal_injury' => [
                'Personal injury specialists fighting for maximum compensation for our clients.',
                'Expert personal injury lawyers with a proven track record of successful claims.',
                'Dedicated personal injury solicitors providing no-win-no-fee representation.',
                'Leading personal injury law firm helping accident victims secure fair compensation.',
                'Specialist personal injury lawyers committed to achieving the best outcomes for clients.'
            ],
            'employment' => [
                'Employment law specialists protecting workers\' rights and employers\' interests.',
                'Expert employment lawyers providing comprehensive workplace legal services.',
                'Leading employment law firm handling all aspects of workplace disputes.',
                'Specialist employment solicitors offering practical legal solutions for workplace issues.',
                'Experienced employment lawyers providing strategic advice to employers and employees.'
            ],
            'general' => [
                'Full-service law firm providing comprehensive legal services across multiple practice areas.',
                'Established legal practice offering expert advice across a wide range of legal matters.',
                'Experienced solicitors providing practical legal solutions for individuals and businesses.',
                'Trusted legal advisors committed to delivering excellent client service.',
                'Professional law firm offering expert legal guidance with a personal touch.'
            ]
        ];

        $this->command->info('Creating 200 law firms with realistic UK data...');

        for ($i = 1; $i <= 200; $i++) {
            // Generate firm name
            $namePattern = $faker->randomElement([
                // Single surname + type
                '{surname} {type}',
                // Two surnames + type
                '{surname} & {surname2} {type}',
                // Three surnames (less common)
                '{surname}, {surname2} & {surname3}',
                // Modern naming
                '{surname} {modern}',
                // Location-based
                '{location} {type}'
            ]);

            $name = str_replace(
                ['{surname}', '{surname2}', '{surname3}', '{type}', '{modern}', '{location}'],
                [
                    $faker->randomElement($surnames),
                    $faker->randomElement($surnames),
                    $faker->randomElement($surnames),
                    $faker->randomElement($firmNames),
                    $faker->randomElement(['Legal', 'Law', 'Legal Services']),
                    $faker->randomElement($ukLocations)
                ],
                $namePattern
            );

            // Clean up the name
            $name = preg_replace('/\s+/', ' ', $name);
            $name = trim($name);

            // Determine primary practice area for description
            $primaryArea = $faker->randomElement(['corporate', 'family', 'criminal', 'property', 'personal_injury', 'employment', 'general']);
            $description = $faker->randomElement($descriptionTemplates[$primaryArea]);

            // Generate location
            $location = $faker->randomElement($ukLocations) . ', UK';

            // Generate UK phone number
            $areaCode = $faker->randomElement(['020', '0121', '0161', '0113', '0114', '0115', '0116', '0117', '0118', '0131', '029']);
            $phone = '+44 ' . $areaCode . ' ' . $faker->numerify('### ####');

            // Generate email
            $emailDomain = strtolower(str_replace([' ', '&', ','], ['', 'and', ''], $name));
            $emailDomain = preg_replace('/[^a-z0-9]/', '', $emailDomain);
            $emailDomain = substr($emailDomain, 0, 20); // Limit length
            $email = $faker->randomElement(['contact', 'info', 'hello', 'office']) . '@' . $emailDomain . '.com';

            // Create the law firm
            $lawFirm = LawFirm::create([
                'name' => $name,
                'description' => $description,
            ]);

            // Create contact information
            LawFirmContact::create([
                'law_firm_id' => $lawFirm->id,
                'label' => 'Main Office',
                'address' => $location,
                'email' => $email,
                'phone' => $phone,
            ]);

            // Assign 1-4 random practice areas
            if ($practiceAreas->isNotEmpty()) {
                $numAreas = $faker->numberBetween(1, 4);
                $selectedAreas = $practiceAreas->random($numAreas);
                $lawFirm->practiceAreas()->attach($selectedAreas->pluck('id'));
            }

            if ($i % 50 === 0) {
                $this->command->info("Created {$i} law firms...");
            }
        }

        $this->command->info('Successfully created 200 law firms!');
        $this->command->info('Law firms created: ' . LawFirm::count());
    }

    /**
     * Create practice areas if they don't exist
     */
    private function createPracticeAreas(): void
    {
        $practiceAreas = [
            'Corporate Law',
            'Family Law',
            'Criminal Law',
            'Property Law',
            'Personal Injury',
            'Employment Law',
            'Immigration Law',
            'Commercial Law',
            'Intellectual Property',
            'Tax Law',
            'Insurance Law',
            'Litigation',
            'Contract Law',
            'Regulatory Compliance',
            'Mergers & Acquisitions',
            'Banking & Finance',
            'Construction Law',
            'Environmental Law',
            'Healthcare Law',
            'Education Law'
        ];

        foreach ($practiceAreas as $area) {
            PracticeArea::firstOrCreate(['name' => $area]);
        }

        $this->command->info('Practice areas ensured: ' . PracticeArea::count());
    }
}