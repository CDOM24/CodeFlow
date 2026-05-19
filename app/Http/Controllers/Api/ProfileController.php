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

    public function completeLesson(Request $request, string $lessonId): JsonResponse
    {
        $data = $request->validate([
            'xp' => ['required', 'integer', 'min:0', 'max:1000'],
        ]);

        $user = $request->attributes->get('auth_user');
        $progress = $user->progreso_lecciones ?? [];

        if (! ($progress[$lessonId] ?? false)) {
            $progress[$lessonId] = true;
            $user->forceFill([
                'xp' => $user->xp + $data['xp'],
                'lecciones_completadas' => $user->lecciones_completadas + 1,
                'progreso_lecciones' => $progress,
            ])->save();
        }

        return response()->json([
            'user' => $this->userPayload($user->fresh()),
        ]);
    }

    public function completeChallenge(Request $request, string $challengeId): JsonResponse
    {
        $data = $request->validate([
            'xp' => ['required', 'integer', 'min:0', 'max:1000'],
        ]);

        $user = $request->attributes->get('auth_user');
        $completed = $user->retos_completados ?? [];

        if (! in_array($challengeId, $completed, true)) {
            $completed[] = $challengeId;
            $user->forceFill([
                'xp' => $user->xp + $data['xp'],
                'retos_completados' => $completed,
            ])->save();
        }

        return response()->json([
            'user' => $this->userPayload($user->fresh()),
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
        return match ($nivel) {
            'Nivel Basico', 'Nivel Básico', 'Nivel BÃ¡sico' => 'Nivel Básico',
            'JavaScript' => 'JavaScript',
            'Proyectos' => 'Proyectos',
            default => 'Nivel 0',
        };
    }
}
