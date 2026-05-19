<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
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
    Route::get('/me', [ProfileController::class, 'show']);
    Route::put('/me', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/lessons/{lessonId}/complete', [ProfileController::class, 'completeLesson']);
    Route::post('/challenges/{challengeId}/complete', [ProfileController::class, 'completeChallenge']);
});
