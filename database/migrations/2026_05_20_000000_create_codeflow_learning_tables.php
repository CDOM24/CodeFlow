<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_levels', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('title');
            $table->text('description');
            $table->string('color')->default('primary');
            $table->string('icon')->default('code');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_unlocked_by_default')->default(false);
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_level_id')->constrained()->cascadeOnDelete();
            $table->string('external_id')->unique();
            $table->string('title');
            $table->string('description');
            $table->unsignedInteger('xp')->default(0);
            $table->string('type')->default('console');
            $table->text('content');
            $table->text('objective')->nullable();
            $table->text('instruction')->nullable();
            $table->text('expected_answer')->nullable();
            $table->text('hint')->nullable();
            $table->text('success_message')->nullable();
            $table->json('blocks')->nullable();
            $table->json('options')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('daily_challenges', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('title');
            $table->string('difficulty')->default('Facil');
            $table->unsignedInteger('xp')->default(0);
            $table->text('description');
            $table->string('expected_answer')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_challenges');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('learning_levels');
    }
};
