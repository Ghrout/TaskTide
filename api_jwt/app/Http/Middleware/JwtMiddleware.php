<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class JwtMiddleware
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param \Illuminate\Http\Request $request El objeto Request que representa la solicitud HTTP entrante.
     * @param \Closure $next La función de cierre que pasa la solicitud al siguiente middleware o controlador.
     * 
     * Este middleware se asegura de que el token JWT en la solicitud sea válido antes de permitir que el usuario
     * acceda a la ruta protegida. Verifica si el token es inválido, ha expirado o si no se ha encontrado.
     * 
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse Retorna una respuesta HTTP o redirecciona.
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Intenta autenticar al usuario analizando el token JWT
            JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            // Si el token es inválido
            if ($e instanceof TokenInvalidException) {
                return response()->json(['status' => 'Invalid Token'], 401);
            }

            // Si el token ha expirado
            if ($e instanceof TokenExpiredException) {
                return response()->json(['status' => 'Expired Token'], 401);
            }

            // Si no se encuentra un token en la solicitud
            return response()->json(['status' => 'Token not found'], 401);
        }

        // Si el token es válido, continuar con la solicitud
        return $next($request);
    }
}