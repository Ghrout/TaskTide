<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Crear una nueva tarea.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los datos de la tarea
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:pending,in_progress,completed',  // El estado es obligatorio
            'priority' => 'nullable|in:low,medium,high',  // La prioridad es opcional
        ]);

        // Crear la nueva tarea
        // @var \App\Models\Task $task Nueva tarea creada
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'status' => $request->status,
            'priority' => $request->priority,
            'user_id' => auth()->id(),  // Asigna la tarea al usuario autenticado
        ]);

        // Devuelve la tarea creada en formato JSON
        return response()->json($task, 201);
    }

    /**
     * Obtener todas las tareas con filtros opcionales por estado y prioridad.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los filtros opcionales
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Recibir los filtros de estado y prioridad de la solicitud
        // @var string|null $status Filtro opcional de estado
        $status = $request->query('status');
        // @var string|null $priority Filtro opcional de prioridad
        $priority = $request->query('priority');

        // Crear la consulta base de tareas
        // @var \Illuminate\Database\Eloquent\Builder $query Consulta base de tareas
        $query = Task::where('user_id', auth()->id()); // Filtra por el ID del usuario autenticado

        // Aplicar filtro por estado si está presente
        if ($status) {
            $query->where('status', $status);
        }

        // Aplicar filtro por prioridad si está presente
        if ($priority) {
            $query->where('priority', $priority);
        }

        // Obtener las tareas paginadas después de aplicar los filtros
        // @var \Illuminate\Pagination\LengthAwarePaginator $tasks Tareas paginadas
        $tasks = $query->paginate(100);

        // Devuelve las tareas filtradas en formato JSON
        return response()->json($tasks);
    }


    /**
     * Obtener una tarea específica.
     *
     * @param \App\Models\Task $task Tarea específica
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Task $task)
    {
        // Devuelve la tarea solicitada en formato JSON
        return response()->json($task);
    }

    /**
     * Actualizar una tarea.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los datos de la tarea
     * @param \App\Models\Task $task Tarea a actualizar
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Task $task)
    {
        // Validar los datos recibidos
        $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|in:pending,in_progress,completed',  // El estado es obligatorio
            'priority' => 'nullable|in:low,medium,high',  // La prioridad es opcional
        ]);

        // Actualizar la tarea con los datos validados
        $task->update($request->only('title', 'description', 'due_date', 'status', 'priority'));

        // Devuelve la tarea actualizada en formato JSON
        return response()->json($task);
    }

    /**
     * Eliminar una tarea.
     *
     * @param \App\Models\Task $task Tarea a eliminar
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Task $task)
    {
        // Eliminar la tarea
        $task->delete();

        // Devuelve una respuesta vacía con el código 204 (sin contenido)
        return response()->json(null, 204);
    }
}