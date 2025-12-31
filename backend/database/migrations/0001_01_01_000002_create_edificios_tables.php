<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ========================================
        // EDIFICIOS
        // ========================================
        Schema::create('edificios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('nombre', 200);
            $table->string('direccion', 300);
            $table->string('comuna', 100);
            $table->string('region', 100)->default('Metropolitana');
            $table->string('rut', 12)->unique();
            $table->enum('tipo', ['condominio', 'comunidad', 'edificio'])->default('condominio');
            $table->integer('total_unidades')->default(0);
            $table->integer('pisos')->nullable();
            $table->integer('subterraneos')->nullable();
            $table->date('fecha_constitucion')->nullable();
            $table->string('rol_principal', 50)->nullable();
            
            // Administrador
            $table->string('administrador_nombre', 200)->nullable();
            $table->string('administrador_rut', 12)->nullable();
            $table->string('administrador_email')->nullable();
            $table->string('administrador_telefono', 20)->nullable();
            $table->date('administrador_desde')->nullable();
            
            // Configuración
            $table->integer('dia_vencimiento_gc')->default(10);
            $table->decimal('interes_mora', 5, 2)->default(1.5);
            $table->decimal('fondo_reserva_porcentaje', 5, 2)->default(5);
            $table->string('moneda_default', 3)->default('CLP');
            
            $table->string('logo')->nullable();
            $table->json('configuracion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'activo']);
        });

        // ========================================
        // PERSONAS
        // ========================================
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('rut', 12);
            $table->enum('tipo_persona', ['natural', 'juridica'])->default('natural');
            $table->string('nombre', 100)->nullable();
            $table->string('apellido_paterno', 100)->nullable();
            $table->string('apellido_materno', 100)->nullable();
            $table->string('razon_social', 200)->nullable();
            $table->string('nombre_completo', 300)->virtualAs(
                "CASE WHEN tipo_persona = 'juridica' THEN razon_social ELSE CONCAT_WS(' ', nombre, apellido_paterno, apellido_materno) END"
            );
            $table->string('email')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('telefono_secundario', 20)->nullable();
            $table->string('direccion', 300)->nullable();
            $table->string('comuna', 100)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('sexo', ['M', 'F'])->nullable();
            $table->string('nacionalidad', 50)->default('Chilena');
            $table->string('estado_civil', 20)->nullable();
            
            // Datos bancarios
            $table->string('banco', 100)->nullable();
            $table->string('tipo_cuenta', 20)->nullable();
            $table->string('numero_cuenta', 30)->nullable();
            
            $table->text('notas')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'rut']);
            $table->index(['tenant_id', 'tipo_persona']);
            $table->index('email');
        });

        // ========================================
        // UNIDADES
        // ========================================
        Schema::create('unidades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('edificio_id')->constrained()->cascadeOnDelete();
            $table->foreignId('propietario_id')->nullable()->constrained('personas')->nullOnDelete();
            $table->foreignId('residente_id')->nullable()->constrained('personas')->nullOnDelete();
            
            $table->string('numero', 20);
            $table->enum('tipo', ['departamento', 'casa', 'local', 'oficina', 'bodega', 'estacionamiento'])->default('departamento');
            $table->integer('piso')->nullable();
            $table->decimal('superficie_util', 10, 2)->nullable();
            $table->decimal('superficie_terraza', 10, 2)->nullable();
            $table->decimal('superficie_total', 10, 2)->nullable();
            $table->decimal('prorrateo', 8, 5)->default(0);
            $table->string('rol_avaluo', 50)->nullable();
            $table->decimal('avaluo_fiscal', 15, 2)->nullable();
            
            // Coeficientes de uso
            $table->decimal('coef_agua', 8, 5)->nullable();
            $table->decimal('coef_gas', 8, 5)->nullable();
            $table->decimal('coef_calefaccion', 8, 5)->nullable();
            
            $table->integer('dormitorios')->nullable();
            $table->integer('banos')->nullable();
            $table->integer('estacionamientos')->default(0);
            $table->integer('bodegas')->default(0);
            
            $table->date('fecha_compra')->nullable();
            $table->decimal('valor_compra', 15, 2)->nullable();
            
            $table->text('observaciones')->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['edificio_id', 'numero']);
            $table->index(['tenant_id', 'edificio_id']);
            $table->index('propietario_id');
        });

        // ========================================
        // INDICADORES ECONÓMICOS
        // ========================================
        Schema::create('indicadores_economicos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10); // UF, UTM, IPC, USD, EUR
            $table->date('fecha');
            $table->decimal('valor', 15, 4);
            $table->string('fuente', 100)->nullable();
            $table->timestamps();

            $table->unique(['codigo', 'fecha']);
            $table->index(['codigo', 'fecha']);
        });

        // ========================================
        // NOTIFICACIONES
        // ========================================
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('tipo', 50); // info, warning, error, success
            $table->string('titulo', 200);
            $table->text('mensaje');
            $table->json('data')->nullable();
            $table->string('url')->nullable();
            $table->boolean('leida')->default(false);
            $table->timestamp('leida_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'leida']);
        });

        // ========================================
        // AUDITORÍA
        // ========================================
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('evento', 50); // login, logout, create, update, delete
            $table->string('modelo')->nullable();
            $table->unsignedBigInteger('modelo_id')->nullable();
            $table->json('datos_anteriores')->nullable();
            $table->json('datos_nuevos')->nullable();
            $table->string('ip', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'created_at']);
            $table->index(['modelo', 'modelo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('notificaciones');
        Schema::dropIfExists('indicadores_economicos');
        Schema::dropIfExists('unidades');
        Schema::dropIfExists('personas');
        Schema::dropIfExists('edificios');
    }
};
