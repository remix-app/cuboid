<?php

/**
 * RUTAS API - PROTECCIÓN DE DATOS PERSONALES
 * Ley 19.628 / Ley 21.719 (2024)
 * 
 * Agregar estas rutas al archivo routes/api.php
 */

use App\Http\Controllers\Api\ProteccionDatosController;

// ========================================
// RUTAS PÚBLICAS - EJERCICIO DE DERECHOS ARCO+
// (Sin autenticación - cualquier titular puede ejercer sus derechos)
// ========================================
Route::prefix('privacidad')->group(function () {
    // Derechos del titular
    Route::post('/derecho-acceso', [ProteccionDatosController::class, 'ejercerDerechoAcceso']);
    Route::post('/derecho-rectificacion', [ProteccionDatosController::class, 'ejercerDerechoRectificacion']);
    Route::post('/derecho-cancelacion', [ProteccionDatosController::class, 'ejercerDerechoCancelacion']);
    Route::post('/derecho-oposicion', [ProteccionDatosController::class, 'ejercerDerechoOposicion']);
    Route::post('/derecho-portabilidad', [ProteccionDatosController::class, 'ejercerDerechoPortabilidad']);
    
    // Consulta estado de solicitud
    Route::get('/solicitud/{numero}', [ProteccionDatosController::class, 'consultarEstadoSolicitud']);
    
    // Política de privacidad pública
    Route::get('/politica', [ProteccionDatosController::class, 'obtenerPoliticaVigente']);
});

// ========================================
// RUTAS AUTENTICADAS - GESTIÓN ADMINISTRATIVA
// ========================================
Route::middleware('auth:sanctum')->prefix('proteccion-datos')->group(function () {
    
    // Dashboard de cumplimiento
    Route::get('/dashboard', [ProteccionDatosController::class, 'dashboardCumplimiento']);
    
    // Gestión de solicitudes ARCO+
    Route::get('/solicitudes', [ProteccionDatosController::class, 'listarSolicitudes']);
    Route::put('/solicitudes/{id}', [ProteccionDatosController::class, 'procesarSolicitud']);
    
    // Consentimientos
    Route::post('/consentimientos', [ProteccionDatosController::class, 'registrarConsentimiento']);
    Route::post('/consentimientos/revocar', [ProteccionDatosController::class, 'revocarConsentimiento']);
    Route::get('/consentimientos/persona/{personaId}', [ProteccionDatosController::class, 'obtenerConsentimientos']);
    
    // Registro de tratamientos
    Route::get('/tratamientos', [ProteccionDatosController::class, 'listarTratamientos']);
    Route::post('/tratamientos', [ProteccionDatosController::class, 'crearTratamiento']);
    
    // Brechas de seguridad
    Route::get('/brechas', [ProteccionDatosController::class, 'listarBrechas']);
    Route::post('/brechas', [ProteccionDatosController::class, 'reportarBrecha']);
    
    // Políticas de privacidad
    Route::post('/politicas', [ProteccionDatosController::class, 'crearPolitica']);
    
    // Anonimización
    Route::post('/anonimizar', [ProteccionDatosController::class, 'anonimizarDatos']);
    
    // Logs de acceso
    Route::get('/logs/persona/{personaId}', [ProteccionDatosController::class, 'logsAccesoPersona']);
});
