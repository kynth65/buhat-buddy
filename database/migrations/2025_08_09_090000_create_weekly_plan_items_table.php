<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('weekly_plan_items', function (Blueprint $table) {
      $table->id();
      $table->foreignId('weekly_plan_id')->constrained('weekly_plans')->onDelete('cascade');
      $table->string('exercise_name');
      $table->unsignedSmallInteger('estimated_reps')->nullable();
      $table->unsignedSmallInteger('sets')->nullable();
      $table->string('notes')->nullable();
      $table->unsignedSmallInteger('position')->default(0);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('weekly_plan_items');
  }
};
