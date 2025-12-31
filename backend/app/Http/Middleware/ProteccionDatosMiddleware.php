<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * MIDDLEWARE: LogAccesoDatosPersonales
 * 
 * Registra automáticamente el acceso a endpoints que manejan datos personales
 * Cumplimiento Ley 19.628 / Ley 21.719
 * 
 * Para registrar en bootstrap/app.php:
 * ->withMiddleware(function (Middleware $middleware) {
 *     $middleware->alias([
 *         'log.datos.personales' => \App\Http\Middleware\LogAccesoDatosPersonales::class,
 *     ]);
 * })
 */
class LogAccesoDatosPersonales
{
    /**
     * Endpoints que manejan datos personales sensibles
     */
    protected array $endpointsSensibles = [
        'personas',
        'empleados', 
        'liquidaciones',
        'unidades',
        'copropietarios',
        'arrendatarios',
        'contratos',
        'distribucion',
        'certificados-renta',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Solo loguear si es exitoso y es un endpoint sensible
        if ($response->isSuccessful() && $this->esEndpointSensible($request)) {
            $this->registrarAcceso($request, $response);
        }

        return $response;
    }

    /**
     * Verificar si el endpoint maneja datos personales
     */
    protected function esEndpointSensible(Request $request): bool
    {
        $path = $request->path();
        
        foreach ($this->endpointsSensibles as $endpoint) {
            if (str_contains($path, $endpoint)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Registrar el acceso en el log
     */
    protected function registrarAcceso(Request $request, Response $response): void
    {
        // Determinar operación
        $operacion = match($request->method()) {
            'GET' => 'lectura',
            'POST' => 'creacion',
            'PUT', 'PATCH' => 'actualizacion',
            'DELETE' => 'eliminacion',
            default => 'lectura',
        };

        // Extraer tabla del path
        $pathParts = explode('/', $request->path());
        $tabla = $pathParts[1] ?? 'desconocida';
        
        // Extraer ID del registro si existe
        $registroId = 0;
        foreach ($pathParts as $part) {
            if (is_numeric($part)) {
                $registroId = (int) $part;
                break;
            }
        }

        // Determinar persona afectada
        $personaAfectadaId = $request->input('persona_id') 
            ?? $request->input('propietario_id')
            ?? $request->input('empleado_id')
            ?? null;

        try {
            DB::table('log_acceso_datos_personales')->insert([
                'tenant_id' => Auth::user()->tenant_id ?? 1,
                'user_id' => Auth::id(),
                'tabla_accedida' => str_replace('-', '_', $tabla),
                'registro_id' => $registroId,
                'persona_afectada_id' => $personaAfectadaId,
                'campos_accedidos' => json_encode(array_keys($request->all())),
                'operacion' => $operacion,
                'motivo' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'endpoint' => $request->path(),
                'exitoso' => true,
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            // No interrumpir el flujo por errores de logging
            \Log::error('Error logging acceso datos: ' . $e->getMessage());
        }
    }
}

/**
 * MIDDLEWARE: VerificarConsentimiento
 * 
 * Verifica que el usuario/persona tenga consentimiento activo para la operación
 */
class VerificarConsentimiento
{
    public function handle(Request $request, Closure $next, string $tipoConsentimiento = 'general'): Response
    {
        $personaId = $request->input('persona_id') ?? Auth::user()->persona_id ?? null;
        
        if (!$personaId) {
            return $next($request);
        }

        $tieneConsentimiento = DB::table('consentimientos_datos')
            ->where('persona_id', $personaId)
            ->where('tipo', $tipoConsentimiento)
            ->where('otorgado', true)
            ->exists();

        if (!$tieneConsentimiento && $tipoConsentimiento !== 'general') {
            return response()->json([
                'error' => 'Consentimiento requerido',
                'mensaje' => "Se requiere consentimiento de tipo '{$tipoConsentimiento}' para esta operación",
                'tipo_requerido' => $tipoConsentimiento,
            ], 403);
        }

        return $next($request);
    }
}

/**
 * MIDDLEWARE: LimitarRetencionDatos
 * 
 * Middleware para ejecutar en cron: elimina/anonimiza datos que excedan período de retención
 */
class LimitarRetencionDatos
{
    public function handle(): void
    {
        // Obtener tratamientos con datos a eliminar
        $tratamientos = DB::table('registro_tratamiento_datos')
            ->where('estado', 'activo')
            ->get();

        foreach ($tratamientos as $tratamiento) {
            $fechaLimite = now()->subMonths($tratamiento->periodo_retencion_meses);
            
            // Aquí implementar lógica según tipo de datos y acción configurada
            // Ejemplo para personas sin actividad
            if ($tratamiento->accion_post_retencion === 'anonimizacion') {
                // Anonimizar registros antiguos sin actividad reciente
                // DB::table($tratamiento->tabla_principal)
                //     ->where('ultima_actividad', '<', $fechaLimite)
                //     ->update(['nombre' => 'ANONIMIZADO', 'email' => null, ...]);
            }
        }
    }
}
