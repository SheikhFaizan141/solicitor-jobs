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
        Schema::create('law_firm_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('law_firm_id')->constrained('law_firms')->cascadeOnDelete();
            $table->string('label')->nullable();
            $table->text('address')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('law_firm_contacts');
    }
};
