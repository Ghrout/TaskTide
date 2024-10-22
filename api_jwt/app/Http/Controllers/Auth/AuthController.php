<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Registrar un nuevo usuario. 
     * @param \Illuminate\Http\Request $request El objeto Request que contiene los datos del formulario de registro. 
     * Este método valida los datos del usuario ('name', 'email', 'password') según las reglas definidas,
     * crea un nuevo usuario en la base de datos y genera un token JWT para el usuario registrado. 
     * @return \Illuminate\Http\JsonResponse Respuesta JSON que contiene el usuario recién creado y su token JWT.
     */
    public function register(Request $request)
    {
        // Validación de los datos del request
        $this->validate($request, [
            'name' => 'required|max:255',
            'email' => 'required|max:255|unique:users',
            'password' => 'required|min:8',
        ]);

        // Creación del usuario en la base de datos
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Generar el token JWT para el usuario registrado
        $token = JWTAuth::fromUser($user);

        // Retornar la respuesta JSON con los datos del usuario y su token
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Iniciar sesión de usuario.
     *
     * @param \App\Http\Requests\Auth\LoginRequest $request El objeto que contiene los datos de inicio de sesión (email y password).
     * Este método intenta autenticar al usuario utilizando las credenciales proporcionadas y genera un token JWT si
     * la autenticación es exitosa. Si falla, devuelve un error adecuado.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON que contiene el token JWT si la autenticación es exitosa,
     * o un mensaje de error si las credenciales son incorrectas.
     */
    public function login(LoginRequest $request)
    {
        // Obtener las credenciales desde el request
        $credencials = $request->only('email', 'password');
        try {
            // Intentar autenticar al usuario con las credenciales proporcionadas
            if (!$token = JWTAuth::attempt($credencials)) {
                // Si las credenciales no son válidas, retornar un error
                return response()->json([
                    'error' => 'Invalid Credentials'
                ], 400);
            }
        } catch (JWTException $te) {
            // Si ocurre algún error al generar el token, retornar un error del servidor
            return response()->json([
                'error' => 'Not create token'
            ], 500);
        }
        // Retornar la respuesta JSON con el token JWT
        return response()->json(compact('token'));
    }
}