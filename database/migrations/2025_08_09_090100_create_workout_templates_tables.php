<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('workout_templates', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('category'); // push, chest, upper, etc.
      $table->string('equipment_type'); // bodyweight, equipment
      $table->timestamps();
    });

    Schema::create('workout_template_items', function (Blueprint $table) {
      $table->id();
      $table->foreignId('workout_template_id')->constrained('workout_templates')->onDelete('cascade');
      $table->string('exercise_name');
      $table->unsignedSmallInteger('estimated_reps')->nullable();
      $table->unsignedSmallInteger('sets')->nullable();
      $table->unsignedSmallInteger('position')->default(0);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('workout_template_items');
    Schema::dropIfExists('workout_templates');
  }
};
