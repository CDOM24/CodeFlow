<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token', 100)->nullable()->unique()->after('remember_token');
            $table->string('avatar', 20)->default(':)')->after('api_token');
            $table->string('nivel')->default('Nivel 0')->after('avatar');
            $table->unsignedInteger('xp')->default(0)->after('nivel');
            $table->unsignedInteger('racha')->default(0)->after('xp');
            $table->unsignedInteger('lecciones_completadas')->default(0)->after('racha');
            $table->json('logros')->nullable()->after('lecciones_completadas');
            $table->json('retos_completados')->nullable()->after('logros');
            $table->json('progreso_lecciones')->nullable()->after('retos_completados');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'api_token',
                'avatar',
                'nivel',
                'xp',
                'racha',
                'lecciones_completadas',
                'logros',
                'retos_completados',
                'progreso_lecciones',
            ]);
        });
    }
};
