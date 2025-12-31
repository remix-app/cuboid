<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportesTributariosController;

/*
|--------------------------------------------------------------------------
| Rutas de Reportes Tributarios
|--------------------------------------------------------------------------
|
| Rutas para:
| - Balance General (formato SII)
| - Estado de Resultados
| - Declaraciones Juradas (DJ 1887)
| - Reportes consolidados de distribución
| - Certificados de no deuda / pago GGCC
| - Checklist cumplimiento legal
|
*/

// Ruta pública para verificar certificados
Route::get('/verificar-certificado/{codigo}', [ReportesTributariosController::class, 'verificarCertificado']);

Route::middleware('auth:sanctum')->group(function () {
    
    // =========================================================================
    // BALANCE GENERAL
    // =========================================================================
    Route::prefix('contabilidad/balance-general')->group(function () {
        Route::get('/', [ReportesTributariosController::class, 'listarBalances']);
        Route::post('/generar', [ReportesTributariosController::class, 'generarBalanceGeneral']);
        Route::get('/{id}/pdf', [ReportesTributariosController::class, 'descargarBalancePdf']);
    });

    // =========================================================================
    // ESTADO DE RESULTADOS
    // =========================================================================
    Route::prefix('contabilidad/estado-resultados')->group(function () {
        Route::get('/', [ReportesTributariosController::class, 'listarEstadosResultados']);
        Route::post('/generar', [ReportesTributariosController::class, 'generarEstadoResultados']);
        Route::get('/{id}/pdf', [ReportesTributariosController::class, 'descargarEstadoResultadosPdf']);
    });

    // =========================================================================
    // DECLARACIONES JURADAS
    // =========================================================================
    Route::prefix('tributario/declaraciones-juradas')->group(function () {
        Route::get('/', [ReportesTributariosController::class, 'listarDeclaraciones']);
        Route::post('/dj1887', [ReportesTributariosController::class, 'generarDJ1887']);
        Route::get('/{id}/csv', [ReportesTributariosController::class, 'descargarDJ1887Csv']);
        Route::get('/{id}/pdf', [ReportesTributariosController::class, 'descargarDJ1887Pdf']);
    });

    // =========================================================================
    // REPORTES CONSOLIDADOS DE DISTRIBUCIÓN
    // =========================================================================
    Route::prefix('distribucion/reportes')->group(function () {
        // Reporte consolidado anual
        Route::post('/consolidado', [ReportesTributariosController::class, 'generarReporteConsolidadoDistribucion']);
        Route::get('/consolidado/{id}', [ReportesTributariosController::class, 'obtenerReporteConsolidado']);
        Route::get('/consolidado/{id}/pdf', [ReportesTributariosController::class, 'descargarReporteConsolidadoPdf']);
        Route::get('/consolidado/{id}/excel', [ReportesTributariosController::class, 'descargarReporteConsolidadoExcel']);
        
        // Detalle por contribuyente
        Route::get('/contribuyente/{personaId}', [ReportesTributariosController::class, 'obtenerDetalleContribuyente']);
        
        // Certificados de renta
        Route::get('/certificado-individual/{detalleId}/pdf', [ReportesTributariosController::class, 'descargarCertificadoIndividual']);
        Route::get('/certificado-consolidado/{personaId}/pdf', [ReportesTributariosController::class, 'descargarCertificadoConsolidado']);
        
        // Generación masiva de certificados
        Route::post('/generar-certificados-masivo', [ReportesTributariosController::class, 'generarCertificadosMasivo']);
    });

    // =========================================================================
    // CERTIFICADOS DE NO DEUDA / PAGO GGCC
    // =========================================================================
    Route::prefix('certificados-deuda')->group(function () {
        Route::get('/', [ReportesTributariosController::class, 'listarCertificadosDeuda']);
        Route::post('/generar', [ReportesTributariosController::class, 'generarCertificadoDeuda']);
        Route::get('/{id}', [ReportesTributariosController::class, 'obtenerCertificadoDeuda']);
        Route::get('/{id}/pdf', [ReportesTributariosController::class, 'descargarCertificadoDeudaPdf']);
        
        // Por unidad
        Route::get('/unidad/{unidadId}/estado', [ReportesTributariosController::class, 'estadoDeudaUnidad']);
        Route::get('/unidad/{unidadId}/historial', [ReportesTributariosController::class, 'historialCertificadosUnidad']);
    });

    // =========================================================================
    // CHECKLIST CUMPLIMIENTO LEGAL
    // =========================================================================
    Route::prefix('cumplimiento')->group(function () {
        // Por unidad
        Route::post('/checklist', [ReportesTributariosController::class, 'generarChecklistCumplimiento']);
        Route::get('/checklist/unidad/{unidadId}', [ReportesTributariosController::class, 'obtenerChecklistUnidad']);
        Route::get('/checklist/unidad/{unidadId}/pdf', [ReportesTributariosController::class, 'descargarChecklistUnidadPdf']);
        
        // Por edificio (resumen todas las unidades)
        Route::get('/checklist/edificio/{edificioId}', [ReportesTributariosController::class, 'checklistEdificio']);
        Route::get('/checklist/edificio/{edificioId}/pdf', [ReportesTributariosController::class, 'descargarChecklistEdificioPdf']);
        Route::get('/checklist/edificio/{edificioId}/excel', [ReportesTributariosController::class, 'descargarChecklistEdificioExcel']);
        
        // Generar checklist masivo
        Route::post('/checklist/generar-masivo', [ReportesTributariosController::class, 'generarChecklistMasivo']);
    });

    // =========================================================================
    // HISTORIAL DE CERTIFICADOS
    // =========================================================================
    Route::prefix('historial-certificados')->group(function () {
        Route::get('/', [ReportesTributariosController::class, 'listarHistorialCertificados']);
        Route::get('/persona/{personaId}', [ReportesTributariosController::class, 'historialCertificadosPersona']);
        Route::get('/estadisticas', [ReportesTributariosController::class, 'estadisticasCertificados']);
    });

    // =========================================================================
    // DASHBOARD TRIBUTARIO
    // =========================================================================
    Route::prefix('tributario/dashboard')->group(function () {
        Route::get('/', [ReportesTributariosController::class, 'dashboardTributario']);
        Route::get('/alertas', [ReportesTributariosController::class, 'alertasTributarias']);
        Route::get('/vencimientos', [ReportesTributariosController::class, 'proximosVencimientos']);
    });
});
