<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * SEEDER: Protección de Datos Personales
 * Datos iniciales para cumplimiento Ley 19.628 / Ley 21.719
 */
class ProteccionDatosSeeder extends Seeder
{
    public function run(): void
    {
        // ========================================
        // REGISTRO DE TRATAMIENTOS DE DATOS
        // ========================================
        $tratamientos = [
            [
                'nombre_tratamiento' => 'Gestión de Copropietarios',
                'descripcion' => 'Tratamiento de datos personales de copropietarios y residentes para la administración del edificio o condominio',
                'categoria_datos' => 'identificacion',
                'datos_sensibles' => false,
                'base_legal' => 'ejecucion_contrato',
                'justificacion_base_legal' => 'Necesario para el cumplimiento del contrato de administración y las obligaciones derivadas de la Ley 21.442 de Copropiedad Inmobiliaria',
                'finalidad_tratamiento' => 'Identificación de copropietarios, emisión de boletas de gastos comunes, comunicaciones relativas a la administración, convocatorias a asambleas, distribución de ingresos',
                'usos_permitidos' => json_encode([
                    'Emisión de boletas de gastos comunes',
                    'Envío de comunicaciones administrativas',
                    'Convocatorias a asambleas',
                    'Distribución de ingresos por arriendos',
                    'Certificados de deuda y cumplimiento',
                ]),
                'campos_recolectados' => json_encode([
                    'rut', 'nombre', 'apellidos', 'email', 'telefono', 'direccion', 'unidad'
                ]),
                'justificacion_campos' => 'Datos mínimos necesarios para identificación, contacto y cumplimiento de obligaciones legales',
                'periodo_retencion_meses' => 120, // 10 años (obligaciones tributarias)
                'justificacion_retencion' => 'Período de prescripción de obligaciones tributarias según Código Tributario (Art. 200)',
                'accion_post_retencion' => 'anonimizacion',
                'transferencia_terceros' => true,
                'destinatarios_transferencia' => json_encode(['SII', 'Bancos (para pagos)', 'Empresas de cobranza (si aplica)']),
                'transferencia_internacional' => false,
                'medidas_seguridad' => json_encode([
                    'Encriptación en tránsito (TLS)',
                    'Encriptación en reposo (AES-256)',
                    'Control de acceso basado en roles',
                    'Logs de auditoría',
                    'Respaldos cifrados',
                ]),
            ],
            [
                'nombre_tratamiento' => 'Gestión de Empleados (RRHH)',
                'descripcion' => 'Tratamiento de datos personales de empleados para la gestión de recursos humanos, remuneraciones y cumplimiento laboral',
                'categoria_datos' => 'laborales',
                'datos_sensibles' => true, // Incluye datos de salud (AFP, Isapre)
                'base_legal' => 'ejecucion_contrato',
                'justificacion_base_legal' => 'Necesario para cumplimiento del contrato de trabajo y obligaciones del Código del Trabajo',
                'finalidad_tratamiento' => 'Pago de remuneraciones, cotizaciones previsionales, declaraciones juradas, certificados laborales',
                'usos_permitidos' => json_encode([
                    'Emisión de liquidaciones de sueldo',
                    'Pago de cotizaciones AFP/Salud/AFC',
                    'Declaración y pago de impuestos',
                    'Certificados laborales',
                    'Comunicaciones laborales',
                ]),
                'campos_recolectados' => json_encode([
                    'rut', 'nombre', 'fecha_nacimiento', 'direccion', 'telefono', 'email',
                    'afp', 'isapre', 'banco', 'cuenta_bancaria', 'sueldo', 'cargas_familiares'
                ]),
                'justificacion_campos' => 'Datos requeridos por Código del Trabajo, DT e instituciones previsionales',
                'periodo_retencion_meses' => 60, // 5 años post término
                'justificacion_retencion' => 'Período de prescripción laboral (5 años) según Art. 510 Código del Trabajo',
                'accion_post_retencion' => 'anonimizacion',
                'transferencia_terceros' => true,
                'destinatarios_transferencia' => json_encode(['AFP', 'Isapres', 'AFC', 'SII', 'Dirección del Trabajo', 'Mutuales']),
                'transferencia_internacional' => false,
                'medidas_seguridad' => json_encode([
                    'Encriptación en tránsito y reposo',
                    'Control de acceso restringido',
                    'Logs de auditoría',
                    'Acceso solo personal autorizado RRHH',
                ]),
            ],
            [
                'nombre_tratamiento' => 'Gestión de Arrendatarios',
                'descripcion' => 'Tratamiento de datos de empresas arrendatarias de espacios comunes (telecomunicaciones)',
                'categoria_datos' => 'identificacion',
                'datos_sensibles' => false,
                'base_legal' => 'ejecucion_contrato',
                'justificacion_base_legal' => 'Necesario para la ejecución del contrato de arriendo',
                'finalidad_tratamiento' => 'Gestión de contratos de arriendo, facturación, cobro de rentas',
                'usos_permitidos' => json_encode([
                    'Emisión de facturas',
                    'Cobro de arriendos',
                    'Comunicaciones contractuales',
                ]),
                'campos_recolectados' => json_encode([
                    'rut_empresa', 'razon_social', 'direccion', 'contacto_nombre', 'contacto_email', 'contacto_telefono'
                ]),
                'justificacion_campos' => 'Datos mínimos para identificación y contacto comercial',
                'periodo_retencion_meses' => 72, // 6 años (obligaciones tributarias)
                'justificacion_retencion' => 'Conservación de documentos tributarios según Art. 17 Código Tributario',
                'accion_post_retencion' => 'archivo',
                'transferencia_terceros' => true,
                'destinatarios_transferencia' => json_encode(['SII']),
                'transferencia_internacional' => false,
                'medidas_seguridad' => json_encode([
                    'Encriptación estándar',
                    'Control de acceso',
                    'Logs de auditoría',
                ]),
            ],
            [
                'nombre_tratamiento' => 'Distribución de Ingresos (Ley 21.713)',
                'descripcion' => 'Tratamiento de datos para distribución de ingresos por arriendo de bienes comunes y emisión de certificados de renta',
                'categoria_datos' => 'financieros',
                'datos_sensibles' => false,
                'base_legal' => 'obligacion_legal',
                'justificacion_base_legal' => 'Cumplimiento Ley 21.713 sobre distribución de ingresos y Art. 17 N°3 Ley de Impuesto a la Renta',
                'finalidad_tratamiento' => 'Cálculo y distribución de ingresos, emisión de certificados de renta para declaración anual',
                'usos_permitidos' => json_encode([
                    'Cálculo de participación por prorrateo',
                    'Emisión de certificados de renta',
                    'Información para declaración de impuestos',
                ]),
                'campos_recolectados' => json_encode([
                    'rut', 'nombre', 'unidad', 'prorrateo', 'montos_distribuidos'
                ]),
                'justificacion_campos' => 'Datos requeridos por SII para certificación de rentas',
                'periodo_retencion_meses' => 72,
                'justificacion_retencion' => 'Período de fiscalización tributaria',
                'accion_post_retencion' => 'archivo',
                'transferencia_terceros' => false,
                'transferencia_internacional' => false,
                'medidas_seguridad' => json_encode([
                    'Encriptación',
                    'Control de acceso',
                    'Logs de auditoría',
                    'Código de verificación en certificados',
                ]),
            ],
            [
                'nombre_tratamiento' => 'Reuniones y Votaciones Telemáticas',
                'descripcion' => 'Tratamiento de datos para gestión de asambleas, quórum y votaciones electrónicas',
                'categoria_datos' => 'comportamiento',
                'datos_sensibles' => false,
                'base_legal' => 'obligacion_legal',
                'justificacion_base_legal' => 'Cumplimiento Ley 21.442 sobre asambleas y DS 7/2025 MINVU',
                'finalidad_tratamiento' => 'Verificación de quórum, registro de asistencia, votaciones, generación de actas',
                'usos_permitidos' => json_encode([
                    'Verificación de identidad y quórum',
                    'Registro de votos',
                    'Generación de actas',
                    'Comunicación de resultados',
                ]),
                'campos_recolectados' => json_encode([
                    'rut', 'nombre', 'unidad', 'prorrateo', 'asistencia', 'votos'
                ]),
                'justificacion_campos' => 'Datos necesarios para validar quórum legal y registrar decisiones',
                'periodo_retencion_meses' => 60,
                'justificacion_retencion' => 'Conservación de actas según Ley 21.442',
                'accion_post_retencion' => 'archivo',
                'transferencia_terceros' => false,
                'transferencia_internacional' => false,
                'medidas_seguridad' => json_encode([
                    'Votación secreta cuando corresponda',
                    'Logs de acceso',
                    'Encriptación de sesiones',
                ]),
            ],
        ];

        foreach ($tratamientos as $tratamiento) {
            DB::table('registro_tratamiento_datos')->insert(array_merge($tratamiento, [
                'tenant_id' => 1,
                'estado' => 'activo',
                'responsable_id' => 1,
                'proxima_revision' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // ========================================
        // POLÍTICA DE PRIVACIDAD INICIAL
        // ========================================
        $politicaHtml = <<<HTML
<h1>Política de Privacidad y Protección de Datos Personales</h1>
<p><strong>Versión 1.0 - Vigente desde: [FECHA]</strong></p>

<h2>1. Responsable del Tratamiento</h2>
<p>[NOMBRE COMUNIDAD/EDIFICIO], RUT [RUT], con domicilio en [DIRECCIÓN], es responsable del tratamiento de sus datos personales conforme a la Ley 19.628 y Ley 21.719.</p>

<h2>2. Datos que Recopilamos</h2>
<ul>
<li><strong>Datos de identificación:</strong> RUT, nombre completo, dirección</li>
<li><strong>Datos de contacto:</strong> Email, teléfono</li>
<li><strong>Datos financieros:</strong> Información bancaria para pagos/cobros</li>
<li><strong>Datos de propiedad:</strong> Unidad, prorrateo, rol de avalúo</li>
</ul>

<h2>3. Finalidades del Tratamiento</h2>
<p>Sus datos son tratados para:</p>
<ul>
<li>Gestión de gastos comunes y cobranzas</li>
<li>Distribución de ingresos por arriendos (Ley 21.713)</li>
<li>Convocatorias a asambleas y comunicaciones</li>
<li>Cumplimiento de obligaciones legales</li>
</ul>

<h2>4. Base Legal</h2>
<p>El tratamiento se fundamenta en:</p>
<ul>
<li>Ejecución del contrato de administración</li>
<li>Cumplimiento de obligaciones legales (Ley 21.442, Código Tributario)</li>
<li>Su consentimiento para comunicaciones no esenciales</li>
</ul>

<h2>5. Sus Derechos (ARCO+)</h2>
<p>Usted tiene derecho a:</p>
<ul>
<li><strong>Acceso:</strong> Conocer qué datos tratamos sobre usted</li>
<li><strong>Rectificación:</strong> Corregir datos inexactos</li>
<li><strong>Cancelación:</strong> Solicitar eliminación de datos</li>
<li><strong>Oposición:</strong> Oponerse a ciertos tratamientos</li>
<li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
</ul>
<p>Para ejercer estos derechos, contacte a: [EMAIL_DPO] o ingrese a nuestra plataforma.</p>
<p><strong>Plazo de respuesta:</strong> 10 días hábiles.</p>

<h2>6. Período de Conservación</h2>
<p>Sus datos se conservan durante la vigencia de su calidad de copropietario y por los períodos legales de prescripción tributaria y civil aplicables.</p>

<h2>7. Transferencia de Datos</h2>
<p>Sus datos pueden ser compartidos con:</p>
<ul>
<li>Servicio de Impuestos Internos (SII)</li>
<li>Instituciones financieras para pagos</li>
<li>Empresas de cobranza (previo aviso)</li>
</ul>
<p>No realizamos transferencias internacionales de datos.</p>

<h2>8. Seguridad</h2>
<p>Implementamos medidas técnicas y organizativas para proteger sus datos, incluyendo encriptación, control de acceso y auditorías periódicas.</p>

<h2>9. Contacto</h2>
<p>Para consultas sobre protección de datos:<br>
Email: [EMAIL_DPO]<br>
Dirección: [DIRECCIÓN]</p>

<h2>10. Actualizaciones</h2>
<p>Esta política puede ser actualizada. Le notificaremos cambios significativos.</p>
HTML;

        DB::table('politicas_privacidad')->insert([
            'tenant_id' => 1,
            'version' => '1.0',
            'titulo' => 'Política de Privacidad y Protección de Datos Personales',
            'contenido_html' => $politicaHtml,
            'contenido_texto' => strip_tags($politicaHtml),
            'fecha_vigencia' => now(),
            'vigente' => true,
            'requiere_nuevo_consentimiento' => false,
            'creado_por' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✓ Tratamientos de datos registrados: ' . count($tratamientos));
        $this->command->info('✓ Política de privacidad v1.0 creada');
    }
}
