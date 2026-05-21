<?php

namespace Tests\Feature;

use Database\Seeders\CodeflowLearningSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_get_profile(): void
    {
        $register = $this->postJson('/api/register', [
            'nombre' => 'Carlos',
            'correo' => 'carlos@example.com',
            'password' => '1234',
            'nivel' => 'Nivel 0',
        ]);

        $register->assertCreated()
            ->assertJsonPath('user.nombre', 'Carlos')
            ->assertJsonStructure(['token', 'user' => ['id', 'nombre', 'correo', 'xp']]);

        $token = $register->json('token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.correo', 'carlos@example.com');
    }

    public function test_user_can_complete_a_lesson_once(): void
    {
        $this->seed(CodeflowLearningSeeder::class);

        $token = $this->postJson('/api/register', [
            'nombre' => 'Carlos',
            'correo' => 'carlos@example.com',
            'password' => '1234',
            'nivel' => 'Nivel 0',
        ])->json('token');

        $this->withToken($token)
            ->postJson('/api/lessons/n0-1/complete', ['blocks' => ['start', 'show-message']])
            ->assertOk()
            ->assertJsonPath('user.xp', 50)
            ->assertJsonPath('user.leccionesCompletadas', 1);

        $this->withToken($token)
            ->postJson('/api/lessons/n0-1/complete', ['blocks' => ['start', 'show-message']])
            ->assertOk()
            ->assertJsonPath('user.xp', 50)
            ->assertJsonPath('user.leccionesCompletadas', 1);
    }

    public function test_lesson_rejects_wrong_answer_and_does_not_add_xp(): void
    {
        $this->seed(CodeflowLearningSeeder::class);

        $token = $this->postJson('/api/register', [
            'nombre' => 'Carlos',
            'correo' => 'wrong@example.com',
            'password' => '1234',
            'nivel' => 'Nivel 0',
        ])->json('token');

        $this->withToken($token)
            ->postJson('/api/lessons/n0-1/complete', ['blocks' => ['show-message', 'start']])
            ->assertUnprocessable();

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.xp', 0);
    }

    public function test_learning_endpoint_returns_levels_and_challenges(): void
    {
        $this->seed(CodeflowLearningSeeder::class);

        $token = $this->postJson('/api/register', [
            'nombre' => 'Carlos',
            'correo' => 'learning@example.com',
            'password' => '1234',
            'nivel' => 'Nivel 0',
        ])->json('token');

        $this->withToken($token)
            ->getJson('/api/learning')
            ->assertOk()
            ->assertJsonPath('levels.0.id', 'nivel-0')
            ->assertJsonPath('levels.0.lecciones.0.tipo', 'reading')
            ->assertJsonPath('challenges.0.id', 'r1');
    }

    public function test_tutor_returns_local_reply_without_anthropic_key(): void
    {
        config(['services.anthropic.key' => null]);

        $token = $this->postJson('/api/register', [
            'nombre' => 'Carlos',
            'correo' => 'tutor@example.com',
            'password' => '1234',
            'nivel' => 'Nivel 0',
        ])->json('token');

        $this->withToken($token)
            ->postJson('/api/tutor/reply', [
                'messages' => [
                    ['role' => 'user', 'content' => 'Que es una variable?'],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('mode', 'local')
            ->assertJsonStructure(['message', 'mode']);
    }
}
