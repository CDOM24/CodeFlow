<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LearningController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TutorController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'CodeFlow API funcionando',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('codeflow.token')->group(function () {
    Route::get('/learning', [LearningController::class, 'index']);
    Route::get('/lessons/{lessonId}', [LearningController::class, 'showLesson']);
    Route::get('/me', [ProfileController::class, 'show']);
    Route::put('/me', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/tutor/reply', [TutorController::class, 'reply']);
    Route::post('/lessons/{lessonId}/complete', [LearningController::class, 'completeLesson']);
    Route::post('/challenges/{challengeId}/complete', [LearningController::class, 'completeChallenge']);
});
