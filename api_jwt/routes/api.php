<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the 'api' middleware group. Enjoy building your API!
|
*/


// Rutas públicas (no requieren autenticación JWT)
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación JWT)
Route::middleware('jwt.verify')->group(function () {
    Route::get('users', [UserController::class, 'index']); // Obtener Usuario
    Route::get('dashboard', [UserController::class, 'dashboard']); // Ingresar dashboard
    Route::get('profile', [UserController::class, 'profile']); // Obtener perfil
    Route::put('profile', [UserController::class, 'updateProfile']); // Actualizar perfil

    Route::controller(TaskController::class)->group(function () {
        Route::post('tasks', 'store'); // Crear tarea
        Route::get('tasks', 'index'); // Obtener tareas
        Route::get('tasks/{task}', 'show'); // Obtener tarea específica
        Route::put('tasks/{task}', 'update'); // Actualizar tarea
        Route::delete('tasks/{task}', 'destroy'); // Eliminar tarea
        Route::post('tasks', 'store');
    });
});