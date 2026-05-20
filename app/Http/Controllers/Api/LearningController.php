<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyChallenge;
use App\Models\LearningLevel;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LearningController extends Controller
{
    public function index(): JsonResponse
    {
        $levels = LearningLevel::with('lessons')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (LearningLevel $level) => $this->levelPayload($level));

        $challenges = DailyChallenge::orderBy('sort_order')
            ->get()
            ->map(fn (DailyChallenge $challenge) => $this->challengePayload($challenge));

        return response()->json([
            'levels' => $levels,
            'challenges' => $challenges,
        ]);
    }

    public function showLesson(string $lessonId): JsonResponse
    {
        $lesson = Lesson::with('level')->where('external_id', $lessonId)->firstOrFail();

        return response()->json([
            'lesson' => $this->lessonPayload($lesson),
            'level' => $this->levelPayload($lesson->level, false),
        ]);
    }

    public function completeLesson(Request $request, string $lessonId): JsonResponse
    {
        $lesson = Lesson::where('external_id', $lessonId)->firstOrFail();
        $data = $request->validate([
            'answer' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'blocks' => ['sometimes', 'array'],
            'blocks.*' => ['string', 'max:100'],
            'selectedOption' => ['sometimes', 'nullable', 'string', 'max:100'],
        ]);

        if (! $this->isCorrectLessonAnswer($lesson, $data)) {
            throw ValidationException::withMessages([
                'answer' => ['La respuesta no coincide con el objetivo de la leccion.'],
            ]);
        }

        $user = $request->attributes->get('auth_user');
        $progress = $user->progreso_lecciones ?? [];

        if (! ($progress[$lesson->external_id] ?? false)) {
            $progress[$lesson->external_id] = true;

            $user->forceFill([
                'xp' => $user->xp + $lesson->xp,
                'lecciones_completadas' => $user->lecciones_completadas + 1,
                'progreso_lecciones' => $progress,
            ])->save();
        }

        return response()->json([
            'user' => $this->userPayload($user->fresh()),
            'lesson' => $this->lessonPayload($lesson),
        ]);
    }

    public function completeChallenge(Request $request, string $challengeId): JsonResponse
    {
        $challenge = DailyChallenge::where('external_id', $challengeId)->firstOrFail();
        $user = $request->attributes->get('auth_user');
        $completed = $user->retos_completados ?? [];

        if (! in_array($challenge->external_id, $completed, true)) {
            $completed[] = $challenge->external_id;
            $user->forceFill([
                'xp' => $user->xp + $challenge->xp,
                'retos_completados' => $completed,
            ])->save();
        }

        return response()->json([
            'user' => $this->userPayload($user->fresh()),
            'challenge' => $this->challengePayload($challenge),
        ]);
    }

    private function isCorrectLessonAnswer(Lesson $lesson, array $data): bool
    {
        return match ($lesson->type) {
            'reading' => true,
            'blocks' => implode('|', $data['blocks'] ?? []) === $lesson->expected_answer,
            'quiz' => ($data['selectedOption'] ?? null) === $lesson->expected_answer,
            default => $this->normalizeCode($data['answer'] ?? '') === $this->normalizeCode($lesson->expected_answer ?? ''),
        };
    }

    private function normalizeCode(string $code): string
    {
        return Str::of($code)
            ->replaceMatches('/\s+/', ' ')
            ->trim()
            ->lower()
            ->toString();
    }

    private function levelPayload(LearningLevel $level, bool $withLessons = true): array
    {
        $payload = [
            'id' => $level->slug,
            'nivel' => $level->name,
            'titulo' => $level->title,
            'descripcion' => $level->description,
            'color' => $level->color,
            'icono' => $level->icon,
            'desbloqueado' => $level->is_unlocked_by_default,
            'sortOrder' => $level->sort_order,
        ];

        if ($withLessons) {
            $payload['lecciones'] = $level->lessons->map(fn (Lesson $lesson) => $this->lessonPayload($lesson))->values();
        }

        return $payload;
    }

    private function lessonPayload(Lesson $lesson): array
    {
        return [
            'id' => $lesson->external_id,
            'titulo' => $lesson->title,
            'descripcion' => $lesson->description,
            'xp' => $lesson->xp,
            'tipo' => $lesson->type,
            'contenido' => $lesson->content,
            'objetivo' => $lesson->objective,
            'instruccion' => $lesson->instruction,
            'codigoEsperado' => $lesson->expected_answer,
            'pista' => $lesson->hint,
            'mensajeExito' => $lesson->success_message,
            'bloques' => $lesson->blocks ?? [],
            'opciones' => $lesson->options ?? [],
        ];
    }

    private function challengePayload(DailyChallenge $challenge): array
    {
        return [
            'id' => $challenge->external_id,
            'titulo' => $challenge->title,
            'dificultad' => $challenge->difficulty,
            'xp' => $challenge->xp,
            'descripcion' => $challenge->description,
        ];
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
}
