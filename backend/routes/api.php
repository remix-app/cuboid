<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\*;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/morosidad', [DashboardController::class, 'morosidad']);
        Route::get('/ingresos', [DashboardController::class, 'ingresos']);
        Route::get('/alertas', [DashboardController::class, 'alertas']);
    });

    // Edificios
    Route::apiResource('edificios', EdificioController::class);
    Route::get('edificios/{edificio}/unidades', [EdificioController::class, 'unidades']);
    Route::get('edificios/{edificio}/estadisticas', [EdificioController::class, 'estadisticas']);

    // Unidades
    Route::apiResource('unidades', UnidadController::class);
    Route::get('unidades/{unidad}/boletas', [UnidadController::class, 'boletas']);
    Route::get('unidades/{unidad}/estado-cuenta', [UnidadController::class, 'estadoCuenta']);

    // Personas
    Route::apiResource('personas', PersonaController::class);

    // Gastos Comunes
    Route::prefix('gastos-comunes')->group(function () {
        Route::get('/periodos', [GastosComunesController::class, 'periodos']);
        Route::post('/periodos', [GastosComunesController::class, 'crearPeriodo']);
        Route::get('/periodos/{periodo}', [GastosComunesController::class, 'showPeriodo']);
        Route::post('/periodos/{periodo}/generar-boletas', [GastosComunesController::class, 'generarBoletas']);
        Route::post('/periodos/{periodo}/cerrar', [GastosComunesController::class, 'cerrarPeriodo']);
        
        Route::get('/boletas', [GastosComunesController::class, 'boletas']);
        Route::get('/boletas/{boleta}', [GastosComunesController::class, 'showBoleta']);
        Route::get('/boletas/{boleta}/pdf', [GastosComunesController::class, 'boletaPdf']);
        
        Route::get('/pagos', [GastosComunesController::class, 'pagos']);
        Route::post('/pagos', [GastosComunesController::class, 'registrarPago']);
        
        Route::get('/morosidad', [GastosComunesController::class, 'morosidad']);
        Route::get('/conceptos', [GastosComunesController::class, 'conceptos']);
    });

    // Arriendos
    Route::prefix('arriendos')->group(function () {
        Route::get('/contratos', [ArriendosController::class, 'contratos']);
        Route::post('/contratos', [ArriendosController::class, 'crearContrato']);
        Route::get('/contratos/{contrato}', [ArriendosController::class, 'showContrato']);
        Route::put('/contratos/{contrato}', [ArriendosController::class, 'updateContrato']);
        
        Route::get('/facturas', [ArriendosController::class, 'facturas']);
        Route::post('/facturas/generar', [ArriendosController::class, 'generarFacturas']);
        Route::get('/facturas/{factura}', [ArriendosController::class, 'showFactura']);
        Route::get('/facturas/{factura}/pdf', [ArriendosController::class, 'facturaPdf']);
        
        Route::get('/arrendatarios', [ArriendosController::class, 'arrendatarios']);
        Route::post('/arrendatarios', [ArriendosController::class, 'crearArrendatario']);
    });

    // Distribución
    Route::prefix('distribucion')->group(function () {
        Route::get('/', [DistribucionController::class, 'index']);
        Route::post('/', [DistribucionController::class, 'crear']);
        Route::get('/{distribucion}', [DistribucionController::class, 'show']);
        Route::post('/{distribucion}/procesar', [DistribucionController::class, 'procesar']);
        Route::post('/{distribucion}/aprobar', [DistribucionController::class, 'aprobar']);
        Route::get('/{distribucion}/detalle', [DistribucionController::class, 'detalle']);
        
        Route::get('/certificados', [DistribucionController::class, 'certificados']);
        Route::post('/certificados/generar-masivo', [DistribucionController::class, 'generarCertificadosMasivo']);
        Route::get('/certificados/{certificado}/pdf', [DistribucionController::class, 'certificadoPdf']);
    });

    // RRHH
    Route::prefix('rrhh')->group(function () {
        Route::apiResource('empleados', RRHHController::class);
        Route::get('empleados/{empleado}/liquidaciones', [RRHHController::class, 'liquidacionesEmpleado']);
        
        Route::get('/liquidaciones', [RRHHController::class, 'liquidaciones']);
        Route::post('/liquidaciones/generar', [RRHHController::class, 'generarLiquidacion']);
        Route::get('/liquidaciones/{liquidacion}', [RRHHController::class, 'showLiquidacion']);
        Route::get('/liquidaciones/{liquidacion}/pdf', [RRHHController::class, 'liquidacionPdf']);
        
        Route::get('/afp', [RRHHController::class, 'afp']);
        Route::get('/isapres', [RRHHController::class, 'isapres']);
        Route::get('/indicadores', [RRHHController::class, 'indicadores']);
    });

    // Contabilidad
    Route::prefix('contabilidad')->group(function () {
        Route::get('/plan-cuentas', [ContabilidadController::class, 'planCuentas']);
        Route::post('/plan-cuentas', [ContabilidadController::class, 'crearCuenta']);
        
        Route::get('/asientos', [ContabilidadController::class, 'asientos']);
        Route::post('/asientos', [ContabilidadController::class, 'crearAsiento']);
        Route::get('/asientos/{asiento}', [ContabilidadController::class, 'showAsiento']);
        
        Route::get('/libro-diario', [ContabilidadController::class, 'libroDiario']);
        Route::get('/libro-mayor', [ContabilidadController::class, 'libroMayor']);
        Route::get('/balance', [ContabilidadController::class, 'balance']);
    });

    // Reuniones
    Route::prefix('reuniones')->group(function () {
        Route::get('/', [ReunionesController::class, 'index']);
        Route::post('/', [ReunionesController::class, 'store']);
        Route::get('/{reunion}', [ReunionesController::class, 'show']);
        Route::put('/{reunion}', [ReunionesController::class, 'update']);
        Route::delete('/{reunion}', [ReunionesController::class, 'destroy']);
        
        Route::post('/{reunion}/convocar', [ReunionesController::class, 'convocar']);
        Route::post('/{reunion}/iniciar', [ReunionesController::class, 'iniciar']);
        Route::post('/{reunion}/finalizar', [ReunionesController::class, 'finalizar']);
        
        Route::get('/{reunion}/convocados', [ReunionesController::class, 'convocados']);
        Route::post('/{reunion}/convocados', [ReunionesController::class, 'agregarConvocados']);
        
        Route::get('/{reunion}/votaciones', [ReunionesController::class, 'votaciones']);
        Route::post('/{reunion}/votaciones', [ReunionesController::class, 'crearVotacion']);
        Route::post('/{reunion}/votaciones/{votacion}/iniciar', [ReunionesController::class, 'iniciarVotacion']);
        Route::post('/{reunion}/votaciones/{votacion}/votar', [ReunionesController::class, 'votar']);
        Route::post('/{reunion}/votaciones/{votacion}/cerrar', [ReunionesController::class, 'cerrarVotacion']);
        
        Route::get('/{reunion}/acta', [ReunionesController::class, 'acta']);
        Route::post('/{reunion}/acta/generar', [ReunionesController::class, 'generarActa']);
    });

    // Asistente Legal
    Route::prefix('legal')->group(function () {
        Route::get('/consultas', [AsistenteLegalController::class, 'index']);
        Route::post('/consultas', [AsistenteLegalController::class, 'consultar']);
        Route::get('/categorias', [AsistenteLegalController::class, 'categorias']);
        Route::get('/faq', [AsistenteLegalController::class, 'faq']);
        
        Route::get('/oficios', [AsistenteLegalController::class, 'oficios']);
        Route::post('/oficios', [AsistenteLegalController::class, 'crearOficio']);
        Route::get('/oficios/{oficio}', [AsistenteLegalController::class, 'showOficio']);
        Route::get('/oficios/{oficio}/pdf', [AsistenteLegalController::class, 'oficioPdf']);
        
        Route::get('/plantillas', [AsistenteLegalController::class, 'plantillas']);
        Route::get('/instituciones', [AsistenteLegalController::class, 'instituciones']);
        
        Route::get('/certificados', [AsistenteLegalController::class, 'certificados']);
        Route::post('/certificados/generar', [AsistenteLegalController::class, 'generarCertificado']);
    });

    // Reportes
    Route::prefix('reportes')->group(function () {
        Route::get('/resumen', [ReportesController::class, 'resumen']);
        Route::get('/morosidad', [ReportesController::class, 'morosidad']);
        Route::get('/recaudacion', [ReportesController::class, 'recaudacion']);
        Route::get('/ingresos-arriendos', [ReportesController::class, 'ingresosArriendos']);
        Route::get('/distribuciones', [ReportesController::class, 'distribuciones']);
        Route::get('/costos-personal', [ReportesController::class, 'costosPersonal']);
        Route::get('/exportar/{tipo}', [ReportesController::class, 'exportar']);
    });

    // Notificaciones
    Route::prefix('notificaciones')->group(function () {
        Route::get('/', [NotificacionController::class, 'index']);
        Route::get('/no-leidas', [NotificacionController::class, 'noLeidas']);
        Route::post('/{notificacion}/leer', [NotificacionController::class, 'marcarLeida']);
        Route::post('/leer-todas', [NotificacionController::class, 'marcarTodasLeidas']);
    });

    // Configuración
    Route::prefix('configuracion')->group(function () {
        Route::get('/', [ConfiguracionController::class, 'index']);
        Route::put('/', [ConfiguracionController::class, 'update']);
    });

    // Usuarios (Admin)
    Route::prefix('usuarios')->middleware('role:admin')->group(function () {
        Route::get('/', [UsuarioController::class, 'index']);
        Route::post('/', [UsuarioController::class, 'store']);
        Route::get('/{usuario}', [UsuarioController::class, 'show']);
        Route::put('/{usuario}', [UsuarioController::class, 'update']);
        Route::delete('/{usuario}', [UsuarioController::class, 'destroy']);
    });

    // Indicadores económicos
    Route::get('/indicadores/uf', [IndicadoresController::class, 'uf']);
    Route::get('/indicadores/utm', [IndicadoresController::class, 'utm']);
    Route::get('/indicadores/todos', [IndicadoresController::class, 'todos']);
});

// Portal Copropietarios
Route::prefix('portal')->middleware('auth:sanctum')->group(function () {
    Route::get('/mi-unidad', [PortalController::class, 'miUnidad']);
    Route::get('/mis-boletas', [PortalController::class, 'misBoletas']);
    Route::get('/mi-estado-cuenta', [PortalController::class, 'miEstadoCuenta']);
    Route::get('/mis-certificados', [PortalController::class, 'misCertificados']);
    Route::get('/comunicados', [PortalController::class, 'comunicados']);
    Route::get('/reuniones', [PortalController::class, 'reuniones']);
});

// Verificación pública de certificados
Route::get('/verificar-certificado/{codigo}', [AsistenteLegalController::class, 'verificarCertificado']);

// Sala de reunión pública
Route::get('/sala/{uuid}', [ReunionesController::class, 'accederSala']);
