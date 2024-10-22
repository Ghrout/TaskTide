<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    /**
     * Obtiene un usuario por su correo electrónico.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $email = $request->query('email'); // Obtén el email de la consulta

        if ($email) {
            $user = User::where('email', $email)->first(); // Busca el usuario por email
            if ($user) {
                return response()->json($user); // Devuelve el usuario encontrado
            }
            return response()->json(['message' => 'Usuario no encontrado'], 404); // Mensaje si no se encuentra el usuario
        }

        // Si no se proporciona email, devuelve todos los usuarios (opcional)
        return response()->json(User::all());
    }

    /**
     * Obtiene la información del usuario autenticado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserInfo()
    {
        // @var \App\Models\User $user Usuario autenticado
        $user = JWTAuth::user();
        // Devuelve la información del usuario autenticado en formato JSON
        return response()->json($user);
    }

    /**
     * Actualiza el perfil del usuario autenticado.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los datos del perfil
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        // @var \App\Models\User $user Usuario autenticado
        $user = JWTAuth::user();

        // Valida los datos de la solicitud
        // @var \Illuminate\Contracts\Validation\Validator $validator Validador de los datos del perfil
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,  // El email debe ser único, excepto para el usuario actual
            'gender' => 'nullable|string|max:10',  // Género opcional
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',  // Imagen de perfil opcional
        ]);

        // Si la validación falla, devuelve los errores
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Actualiza el nombre y el email del usuario
        $user->name = $request->name;
        $user->email = $request->email;

        // Si se sube una nueva imagen de perfil, la guarda y actualiza el campo 'profile_image'
        if ($request->hasFile('profile_image')) {
            // @var string $imagePath Ruta de la imagen guardada
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $imagePath;
        }

        // Si se proporciona el género, lo actualiza
        if ($request->has('gender')) {
            $user->gender = $request->gender;
        }

        // Guarda los cambios en la base de datos
        $user->save();

        // Devuelve el usuario actualizado en formato JSON
        return response()->json($user);
    }

    /**
     * Registra un nuevo usuario.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los datos del nuevo usuario
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Valida los datos de la solicitud
        // @var \Illuminate\Contracts\Validation\Validator $validator Validador de los datos del nuevo usuario
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',  // El email debe ser único
            'password' => 'required|string|min:6',  // La contraseña debe tener al menos 6 caracteres
        ]);

        // Si la validación falla, devuelve los errores
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Crea un nuevo usuario
        // @var \App\Models\User $user Nuevo usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),  // Encripta la contraseña
        ]);

        // Devuelve el nuevo usuario en formato JSON
        return response()->json($user, 201);
    }

    /**
     * Muestra la información de un usuario específico.
     *
     * @param \App\Models\User $user Usuario específico
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        // Devuelve la información del usuario en formato JSON
        return response()->json($user);
    }

    /**
     * Actualiza un usuario específico.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los datos actualizados
     * @param \App\Models\User $user Usuario a actualizar
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        // Valida los datos de la solicitud
        // @var \Illuminate\Contracts\Validation\Validator $validator Validador de los datos actualizados
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,  // El email debe ser único, excepto para el usuario actual
        ]);

        // Si la validación falla, devuelve los errores
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Actualiza el nombre y el email del usuario
        $user->update($request->only(['name', 'email']));

        // Devuelve el usuario actualizado en formato JSON
        return response()->json($user);
    }

    /**
     * Elimina un usuario específico.
     *
     * @param \App\Models\User $user Usuario a eliminar
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        // Elimina el usuario de la base de datos
        $user->delete();

        // Devuelve una respuesta vacía con el código 204 (sin contenido)
        return response()->json(null, 204);
    }
}