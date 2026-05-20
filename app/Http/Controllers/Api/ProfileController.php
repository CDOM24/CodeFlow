<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->userPayload($request->attributes->get('auth_user')),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        $data = $request->validate([
            'nombre' => ['sometimes', 'string', 'min:2', 'max:255'],
            'avatar' => ['sometimes', 'string', 'max:20'],
            'nivel' => ['sometimes', 'string', 'max:50'],
        ]);

        $user->fill([
            'name' => $data['nombre'] ?? $user->name,
            'avatar' => $data['avatar'] ?? $user->avatar,
            'nivel' => isset($data['nivel']) ? $this->normalizeNivel($data['nivel']) : $user->nivel,
        ])->save();

        return response()->json([
            'user' => $this->userPayload($user),
        ]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'nombre' => $user->name,
            'correo' => $user->email,
            'avatar' => $user->avatar,
            'nivel' => $user->nivel,
            'xp' => $user->xp,
            'racha' => $user->racha,
            'leccionesCompletadas' => $user->lecciones_completadas,
            'logros' => $user->logros ?? [],
            'retosCompletados' => $user->retos_completados ?? [],
            'progresoLecciones' => $user->progreso_lecciones ?? [],
        ];
    }

    private function normalizeNivel(string $nivel): string
    {
        if (str_contains($nivel, 'Bas') || str_contains($nivel, 'Bás') || str_contains($nivel, 'BÃ')) {
            return 'Nivel Basico';
        }

        return match ($nivel) {
            'JavaScript' => 'JavaScript',
            'Proyectos' => 'Proyectos',
            default => 'Nivel 0',
        };
    }
}
