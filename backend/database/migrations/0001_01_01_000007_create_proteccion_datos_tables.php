<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CUMPLIMIENTO LEY 19.628 / LEY 21.719 (2024)
 * Protección de la Vida Privada y Datos Personales
 * 
 * Principios implementados:
 * - LICITUD: Base legal para cada tratamiento
 * - FINALIDAD: Propósito específico documentado
 * - MINIMIZACIÓN: Solo datos necesarios
 * - EXACTITUD: Mecanismos de actualización
 * - LIMITACIÓN DE CONSERVACIÓN: Políticas de retención
 * - SEGURIDAD: Logs de acceso y auditoría
 * - RESPONSABILIDAD DEMOSTRADA: Registros de cumplimiento
 */
return new class extends Migration
{
    public function up(): void
    {
        // ========================================
        // REGISTRO DE TRATAMIENTO DE DATOS (Art. 14 bis Ley 21.719)
        // ========================================
        Schema::create('registro_tratamiento_datos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            
            // Identificación del tratamiento
            $table->string('nombre_tratamiento', 200);
            $table->text('descripcion');
            $table->enum('categoria_datos', [
                'identificacion',      // RUT, nombre, dirección
                'contacto',            // Email, teléfono
                'financieros',         // Datos bancarios, deudas
                'laborales',           // Contratos, remuneraciones
                'salud',               // AFP, Isapre (datos sensibles)
                'biometricos',         // Huellas, reconocimiento facial
                'ubicacion',           // Geolocalización
                'comportamiento',      // Historial de acciones
            ]);
            $table->boolean('datos_sensibles')->default(false);
            
            // Base legal (Art. 13 Ley 21.719)
            $table->enum('base_legal', [
                'consentimiento',           // Consentimiento expreso del titular
                'ejecucion_contrato',       // Necesario para contrato
                'obligacion_legal',         // Cumplimiento de ley
                'interes_vital',            // Proteger vida del titular
                'interes_publico',          // Función pública
                'interes_legitimo',         // Interés legítimo del responsable
            ]);
            $table->text('justificacion_base_legal');
            
            // Finalidad específica (Principio de finalidad)
            $table->text('finalidad_tratamiento');
            $table->json('usos_permitidos'); // Array de usos específicos
            
            // Minimización
            $table->json('campos_recolectados'); // Solo campos necesarios
            $table->text('justificacion_campos');
            
            // Conservación (Principio de limitación temporal)
            $table->integer('periodo_retencion_meses');
            $table->text('justificacion_retencion');
            $table->enum('accion_post_retencion', ['eliminacion', 'anonimizacion', 'archivo']);
            
            // Transferencias
            $table->boolean('transferencia_terceros')->default(false);
            $table->json('destinatarios_transferencia')->nullable();
            $table->boolean('transferencia_internacional')->default(false);
            $table->string('paises_destino')->nullable();
            
            // Medidas de seguridad
            $table->json('medidas_seguridad'); // Encriptación, acceso, etc.
            
            // Estado y auditoría
            $table->enum('estado', ['activo', 'suspendido', 'eliminado'])->default('activo');
            $table->foreignId('responsable_id')->nullable()->constrained('users');
            $table->timestamp('ultima_revision')->nullable();
            $table->timestamp('proxima_revision')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================================
        // CONSENTIMIENTOS (Art. 12 Ley 21.719)
        // ========================================
        Schema::create('consentimientos_datos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('persona_id')->constrained('personas')->onDelete('cascade');
            $table->foreignId('tratamiento_id')->constrained('registro_tratamiento_datos');
            
            // Tipo de consentimiento
            $table->enum('tipo', [
                'general',              // Tratamiento general
                'marketing',            // Comunicaciones comerciales
                'compartir_terceros',   // Transferencia a terceros
                'datos_sensibles',      // Datos de salud, etc.
                'perfilamiento',        // Decisiones automatizadas
                'internacional',        // Transferencia internacional
            ]);
            
            // Estado del consentimiento
            $table->boolean('otorgado')->default(false);
            $table->timestamp('fecha_otorgamiento')->nullable();
            $table->timestamp('fecha_revocacion')->nullable();
            $table->string('ip_otorgamiento')->nullable();
            $table->string('user_agent')->nullable();
            
            // Evidencia (Responsabilidad demostrada)
            $table->text('texto_consentimiento'); // Texto exacto mostrado
            $table->string('version_politica', 20); // Versión de política aceptada
            $table->string('metodo_obtencion', 50); // web, app, papel, telefono
            $table->string('evidencia_path')->nullable(); // Documento firmado si aplica
            
            // Renovación
            $table->boolean('requiere_renovacion')->default(false);
            $table->timestamp('fecha_vencimiento')->nullable();
            $table->boolean('recordatorio_enviado')->default(false);
            
            $table->timestamps();
            
            $table->unique(['persona_id', 'tratamiento_id', 'tipo']);
        });

        // ========================================
        // DERECHOS ARCO+ (Art. 4-10 Ley 21.719)
        // Acceso, Rectificación, Cancelación, Oposición, Portabilidad
        // ========================================
        Schema::create('solicitudes_derechos_datos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('numero_solicitud', 20)->unique();
            
            // Solicitante
            $table->foreignId('persona_id')->nullable()->constrained('personas');
            $table->string('nombre_solicitante', 200);
            $table->string('rut_solicitante', 12);
            $table->string('email_solicitante');
            $table->string('telefono_solicitante')->nullable();
            
            // Tipo de derecho ejercido
            $table->enum('tipo_derecho', [
                'acceso',           // Conocer qué datos tenemos
                'rectificacion',    // Corregir datos inexactos
                'cancelacion',      // Eliminar datos (supresión)
                'oposicion',        // Oponerse al tratamiento
                'portabilidad',     // Obtener datos en formato estructurado
                'limitacion',       // Restringir tratamiento
                'no_decision_auto', // No ser objeto de decisiones automatizadas
            ]);
            
            // Detalle de la solicitud
            $table->text('descripcion_solicitud');
            $table->json('datos_afectados')->nullable(); // Campos específicos
            $table->text('motivo')->nullable();
            
            // Verificación de identidad
            $table->boolean('identidad_verificada')->default(false);
            $table->string('metodo_verificacion')->nullable();
            $table->timestamp('fecha_verificacion')->nullable();
            
            // Gestión
            $table->enum('estado', [
                'recibida',
                'en_verificacion',
                'en_proceso',
                'requiere_info',
                'aprobada',
                'rechazada',
                'completada',
            ])->default('recibida');
            
            $table->timestamp('fecha_recepcion');
            $table->timestamp('fecha_limite_respuesta'); // 10 días hábiles (Art. 15)
            $table->timestamp('fecha_respuesta')->nullable();
            
            // Respuesta
            $table->text('respuesta')->nullable();
            $table->string('motivo_rechazo')->nullable();
            $table->json('acciones_realizadas')->nullable();
            $table->string('archivo_respuesta')->nullable();
            
            // Responsable
            $table->foreignId('atendido_por')->nullable()->constrained('users');
            
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================================
        // LOG DE ACCESO A DATOS PERSONALES (Seguridad y auditoría)
        // ========================================
        Schema::create('log_acceso_datos_personales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            // Qué se accedió
            $table->string('tabla_accedida', 100);
            $table->unsignedBigInteger('registro_id');
            $table->foreignId('persona_afectada_id')->nullable()->constrained('personas');
            $table->json('campos_accedidos'); // Campos específicos vistos
            
            // Tipo de operación
            $table->enum('operacion', [
                'lectura',
                'creacion',
                'actualizacion',
                'eliminacion',
                'exportacion',
                'impresion',
                'envio_email',
                'consulta_masiva',
            ]);
            
            // Contexto
            $table->string('motivo', 200)->nullable();
            $table->string('ip_address', 45);
            $table->string('user_agent')->nullable();
            $table->string('endpoint', 200)->nullable();
            
            // Resultado
            $table->boolean('exitoso')->default(true);
            $table->string('error')->nullable();
            
            $table->timestamp('created_at');
            
            // Índices para búsqueda rápida
            $table->index(['persona_afectada_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index(['tabla_accedida', 'registro_id']);
        });

        // ========================================
        // BRECHAS DE SEGURIDAD (Art. 14 ter Ley 21.719)
        // ========================================
        Schema::create('brechas_seguridad_datos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('numero_incidente', 20)->unique();
            
            // Descripción del incidente
            $table->timestamp('fecha_deteccion');
            $table->timestamp('fecha_ocurrencia')->nullable();
            $table->text('descripcion');
            $table->enum('tipo_brecha', [
                'acceso_no_autorizado',
                'perdida_datos',
                'robo_datos',
                'divulgacion_accidental',
                'ataque_cibernetico',
                'error_humano',
                'falla_sistema',
            ]);
            
            // Alcance
            $table->json('tipos_datos_afectados');
            $table->integer('cantidad_registros_afectados')->nullable();
            $table->integer('cantidad_titulares_afectados')->nullable();
            $table->boolean('datos_sensibles_afectados')->default(false);
            
            // Evaluación de riesgo
            $table->enum('nivel_riesgo', ['bajo', 'medio', 'alto', 'critico']);
            $table->text('evaluacion_impacto');
            $table->boolean('riesgo_derechos_libertades')->default(false);
            
            // Acciones tomadas
            $table->json('medidas_contencion');
            $table->json('medidas_correctivas');
            $table->timestamp('fecha_contencion')->nullable();
            
            // Notificaciones (72 horas a Agencia según Ley 21.719)
            $table->boolean('notificado_agencia')->default(false);
            $table->timestamp('fecha_notificacion_agencia')->nullable();
            $table->string('numero_caso_agencia')->nullable();
            
            $table->boolean('notificado_titulares')->default(false);
            $table->timestamp('fecha_notificacion_titulares')->nullable();
            $table->text('contenido_notificacion_titulares')->nullable();
            
            // Estado
            $table->enum('estado', [
                'detectada',
                'en_investigacion',
                'contenida',
                'notificada',
                'resuelta',
                'cerrada',
            ])->default('detectada');
            
            // Responsables
            $table->foreignId('detectado_por')->nullable()->constrained('users');
            $table->foreignId('responsable_gestion')->nullable()->constrained('users');
            
            $table->text('lecciones_aprendidas')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================================
        // POLÍTICAS DE PRIVACIDAD (Versionadas)
        // ========================================
        Schema::create('politicas_privacidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            
            $table->string('version', 20);
            $table->string('titulo', 200);
            $table->longText('contenido_html');
            $table->longText('contenido_texto'); // Para lectura automática
            
            $table->json('cambios_desde_anterior')->nullable();
            $table->text('resumen_cambios')->nullable();
            
            $table->timestamp('fecha_vigencia');
            $table->timestamp('fecha_fin_vigencia')->nullable();
            $table->boolean('vigente')->default(false);
            $table->boolean('requiere_nuevo_consentimiento')->default(false);
            
            $table->foreignId('creado_por')->constrained('users');
            $table->foreignId('aprobado_por')->nullable()->constrained('users');
            $table->timestamp('fecha_aprobacion')->nullable();
            
            $table->timestamps();
            
            $table->unique(['tenant_id', 'version']);
        });

        // ========================================
        // EVALUACIÓN DE IMPACTO (EIPD) - Art. 14 quater Ley 21.719
        // ========================================
        Schema::create('evaluaciones_impacto_privacidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('tratamiento_id')->constrained('registro_tratamiento_datos');
            
            $table->string('numero_evaluacion', 20)->unique();
            $table->date('fecha_evaluacion');
            
            // Descripción del tratamiento evaluado
            $table->text('descripcion_tratamiento');
            $table->text('necesidad_proporcionalidad');
            
            // Análisis de riesgos
            $table->json('riesgos_identificados');
            $table->json('medidas_mitigacion');
            $table->enum('riesgo_residual', ['bajo', 'medio', 'alto']);
            
            // Consultas
            $table->boolean('consulta_delegado')->default(false);
            $table->text('opinion_delegado')->nullable();
            $table->boolean('consulta_agencia')->default(false);
            $table->text('respuesta_agencia')->nullable();
            
            // Decisión
            $table->enum('decision', ['aprobado', 'aprobado_condiciones', 'rechazado']);
            $table->text('condiciones')->nullable();
            
            $table->foreignId('evaluador_id')->constrained('users');
            $table->foreignId('aprobador_id')->nullable()->constrained('users');
            
            $table->timestamps();
        });

        // ========================================
        // ENCARGADOS DE TRATAMIENTO (Terceros)
        // ========================================
        Schema::create('encargados_tratamiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            
            $table->string('rut', 12);
            $table->string('razon_social', 200);
            $table->string('contacto_nombre', 100);
            $table->string('contacto_email');
            $table->string('contacto_telefono')->nullable();
            $table->text('direccion');
            
            // Contrato
            $table->date('fecha_contrato');
            $table->date('fecha_termino')->nullable();
            $table->string('documento_contrato')->nullable();
            
            // Tratamientos encargados
            $table->json('tratamientos_autorizados');
            $table->json('medidas_seguridad_exigidas');
            $table->boolean('subencargo_permitido')->default(false);
            
            // Auditoría
            $table->date('ultima_auditoria')->nullable();
            $table->text('resultado_auditoria')->nullable();
            $table->date('proxima_auditoria')->nullable();
            
            $table->boolean('activo')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================================
        // DELEGADO DE PROTECCIÓN DE DATOS (DPO)
        // ========================================
        Schema::create('delegados_proteccion_datos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            
            $table->string('nombre', 200);
            $table->string('email');
            $table->string('telefono')->nullable();
            $table->boolean('interno')->default(true); // O externo
            $table->string('empresa_externa')->nullable();
            
            $table->date('fecha_designacion');
            $table->date('fecha_termino')->nullable();
            $table->boolean('activo')->default(true);
            
            // Publicación (obligatoria según ley)
            $table->boolean('publicado_web')->default(false);
            $table->boolean('comunicado_agencia')->default(false);
            
            $table->timestamps();
        });

        // ========================================
        // ANONIMIZACIÓN Y PSEUDONIMIZACIÓN
        // ========================================
        Schema::create('datos_anonimizados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            
            $table->string('tabla_origen', 100);
            $table->unsignedBigInteger('registro_origen_id');
            $table->json('datos_anonimizados');
            
            $table->enum('tipo', ['anonimizacion', 'pseudonimizacion']);
            $table->string('algoritmo_usado', 50);
            $table->string('clave_pseudonimizacion')->nullable(); // Solo para pseudonimización
            
            $table->string('motivo', 200);
            $table->foreignId('ejecutado_por')->constrained('users');
            
            $table->timestamp('created_at');
            
            $table->index(['tabla_origen', 'registro_origen_id']);
        });

        // ========================================
        // AGREGAR CAMPOS A TABLAS EXISTENTES
        // ========================================
        
        // Personas - agregar campos de consentimiento
        Schema::table('personas', function (Blueprint $table) {
            $table->boolean('acepta_politica_privacidad')->default(false)->after('activo');
            $table->timestamp('fecha_aceptacion_politica')->nullable();
            $table->string('version_politica_aceptada', 20)->nullable();
            $table->boolean('acepta_comunicaciones_comerciales')->default(false);
            $table->boolean('acepta_compartir_terceros')->default(false);
            $table->timestamp('ultima_actualizacion_datos')->nullable();
            $table->foreignId('datos_actualizados_por')->nullable()->constrained('users');
        });

        // Users - agregar último acceso a datos sensibles
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('ultimo_acceso_datos_sensibles')->nullable();
            $table->boolean('capacitacion_proteccion_datos')->default(false);
            $table->date('fecha_capacitacion_datos')->nullable();
        });
    }

    public function down(): void
    {
        // Revertir campos agregados
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ultimo_acceso_datos_sensibles', 'capacitacion_proteccion_datos', 'fecha_capacitacion_datos']);
        });

        Schema::table('personas', function (Blueprint $table) {
            $table->dropColumn([
                'acepta_politica_privacidad', 'fecha_aceptacion_politica', 'version_politica_aceptada',
                'acepta_comunicaciones_comerciales', 'acepta_compartir_terceros',
                'ultima_actualizacion_datos', 'datos_actualizados_por'
            ]);
        });

        Schema::dropIfExists('datos_anonimizados');
        Schema::dropIfExists('delegados_proteccion_datos');
        Schema::dropIfExists('encargados_tratamiento');
        Schema::dropIfExists('evaluaciones_impacto_privacidad');
        Schema::dropIfExists('politicas_privacidad');
        Schema::dropIfExists('brechas_seguridad_datos');
        Schema::dropIfExists('log_acceso_datos_personales');
        Schema::dropIfExists('solicitudes_derechos_datos');
        Schema::dropIfExists('consentimientos_datos');
        Schema::dropIfExists('registro_tratamiento_datos');
    }
};
