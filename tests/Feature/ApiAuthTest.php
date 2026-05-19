<?php

namespace Tests\Feature;

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
        $token = $this->postJson('/api/register', [
            'nombre' => 'Carlos',
            'correo' => 'carlos@example.com',
            'password' => '1234',
            'nivel' => 'Nivel 0',
        ])->json('token');

        $this->withToken($token)
            ->postJson('/api/lessons/n0-1/complete', ['xp' => 50])
            ->assertOk()
            ->assertJsonPath('user.xp', 50)
            ->assertJsonPath('user.leccionesCompletadas', 1);

        $this->withToken($token)
            ->postJson('/api/lessons/n0-1/complete', ['xp' => 50])
            ->assertOk()
            ->assertJsonPath('user.xp', 50)
            ->assertJsonPath('user.leccionesCompletadas', 1);
    }
}
