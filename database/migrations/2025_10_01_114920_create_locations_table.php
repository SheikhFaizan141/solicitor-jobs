<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type'); // city, region, country, remote
            $table->string('region')->nullable(); // e.g. England, Scotland
            $table->string('country')->nullable(); // e.g. UK, USA
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_remote')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('popularity')->default(0);  //Auto-calculated based on job count
            $table->json('metadata')->nullable(); // Additional data like postcodes, time zones
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
