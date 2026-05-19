<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'min:2', 'max:255'],
            'correo' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'nivel' => ['required', 'string', 'max:50'],
        ]);

        $user = User::create([
            'name' => $data['nombre'],
            'email' => $data['correo'],
            'password' => Hash::make($data['password']),
            'api_token' => Str::random(80),
            'nivel' => $this->normalizeNivel($data['nivel']),
            'xp' => 0,
            'racha' => 0,
            'lecciones_completadas' => 0,
            'logros' => [],
            'retos_completados' => [],
            'progreso_lecciones' => [],
        ]);

        return response()->json([
            'token' => $user->api_token,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'correo' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['correo'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'correo' => ['Las credenciales no son validas.'],
            ]);
        }

        $user->forceFill([
            'api_token' => Str::random(80),
        ])->save();

        return response()->json([
            'token' => $user->api_token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->attributes->get('auth_user')->forceFill([
            'api_token' => null,
        ])->save();

        return response()->json([
            'message' => 'Sesion cerrada correctamente',
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
