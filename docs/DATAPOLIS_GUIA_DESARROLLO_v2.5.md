# DATAPOLIS PRO - Guía de Desarrollo

**Versión:** 1.1  
**Fecha:** Diciembre 2025

---

## 1. Configuración del Entorno

### 1.1 Requisitos Previos

```bash
# Verificar versiones
php -v        # >= 8.2
node -v       # >= 18
npm -v        # >= 9
composer -V   # >= 2.5
mysql --version  # >= 8.0
redis-cli --version  # >= 7.0
```

### 1.2 Clonar Repositorio

```bash
git clone https://github.com/datapolis/datapolis-pro.git
cd datapolis-pro
```

### 1.3 Configurar Backend

```bash
cd backend

# Instalar dependencias
composer install

# Copiar configuración
cp .env.example .env

# Generar key
php artisan key:generate

# Configurar .env
nano .env
```

Variables importantes en `.env`:
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=datapolis
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 1.4 Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE datapolis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Ejecutar migraciones
php artisan migrate

# Cargar datos de prueba
php artisan db:seed
```

### 1.5 Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar configuración
cp .env.example .env.local

# Configurar API URL
echo "VITE_API_URL=http://localhost:8000/api" > .env.local
```

### 1.6 Iniciar Servidores de Desarrollo

Terminal 1 - Backend:
```bash
cd backend
php artisan serve
# http://localhost:8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# http://localhost:5173
```

Terminal 3 - Queue Worker (opcional):
```bash
cd backend
php artisan queue:work
```

---

## 2. Estructura del Proyecto

### 2.1 Backend (Laravel 11)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/           # Controladores REST
│   │   ├── Middleware/        # Middleware personalizado
│   │   └── Requests/          # Form Requests (validación)
│   ├── Models/                # Modelos Eloquent
│   ├── Services/              # Lógica de negocio
│   ├── Jobs/                  # Tareas asíncronas
│   ├── Notifications/         # Notificaciones
│   └── Policies/              # Autorización
├── config/                    # Configuraciones
├── database/
│   ├── migrations/            # Migraciones BD
│   └── seeders/               # Datos iniciales
├── resources/
│   └── views/
│       └── pdf/               # Plantillas PDF (Blade)
├── routes/
│   ├── api.php                # Rutas API principales
│   └── proteccion_datos.php   # Rutas protección datos
├── storage/                   # Archivos generados
└── tests/                     # Tests
```

### 2.2 Frontend (React + Vite)

```
frontend/
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── layout/            # Layout, Sidebar, Header
│   │   └── ui/                # Botones, Cards, Modals
│   ├── pages/                 # Páginas principales
│   ├── services/              # Servicios API (Axios)
│   ├── context/               # React Context (Auth)
│   ├── hooks/                 # Custom hooks
│   ├── utils/                 # Utilidades
│   └── styles/                # Estilos globales
├── public/                    # Assets estáticos
└── index.html
```

---

## 3. Convenciones de Código

### 3.1 PHP/Laravel

**Nombrado:**
```php
// Modelos: PascalCase singular
class Edificio extends Model {}
class BoletaGC extends Model {}

// Controladores: PascalCase + Controller
class EdificioController extends Controller {}

// Tablas: snake_case plural
Schema::create('edificios', ...);
Schema::create('boletas_gc', ...);

// Métodos: camelCase
public function getEstadoCuenta() {}

// Variables: camelCase
$totalPagado = $boleta->total_pagado;
```

**Estructura de Controlador:**
```php
class EdificioController extends Controller
{
    // GET /edificios
    public function index(Request $request)
    {
        $edificios = Edificio::where('tenant_id', auth()->user()->tenant_id)
            ->paginate(20);
        
        return response()->json($edificios);
    }

    // GET /edificios/{id}
    public function show(Edificio $edificio)
    {
        $this->authorize('view', $edificio);
        return response()->json($edificio->load('unidades'));
    }

    // POST /edificios
    public function store(StoreEdificioRequest $request)
    {
        $edificio = Edificio::create([
            'tenant_id' => auth()->user()->tenant_id,
            ...$request->validated()
        ]);

        return response()->json($edificio, 201);
    }

    // PUT /edificios/{id}
    public function update(UpdateEdificioRequest $request, Edificio $edificio)
    {
        $this->authorize('update', $edificio);
        $edificio->update($request->validated());
        
        return response()->json($edificio);
    }

    // DELETE /edificios/{id}
    public function destroy(Edificio $edificio)
    {
        $this->authorize('delete', $edificio);
        $edificio->delete();
        
        return response()->json(['message' => 'Eliminado']);
    }
}
```

**Form Request:**
```php
class StoreEdificioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:200',
            'rut' => 'required|string|max:12|cl_rut',
            'direccion' => 'required|string|max:255',
            'comuna' => 'required|string|max:100',
            'tipo' => 'required|in:condominio,comunidad,edificio',
            'total_unidades' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'rut.cl_rut' => 'El RUT no es válido',
        ];
    }
}
```

### 3.2 TypeScript/React

**Nombrado:**
```typescript
// Componentes: PascalCase
export function EdificioCard({ edificio }: EdificioCardProps) {}

// Hooks: camelCase con prefijo use
export function useEdificios() {}

// Servicios: camelCase
export const edificioService = { ... }

// Interfaces: PascalCase con prefijo I o sufijo Props/State
interface IEdificio {}
interface EdificioCardProps {}
```

**Estructura de Página:**
```tsx
import { useState, useEffect } from 'react';
import { edificioService } from '../services/api';

interface Edificio {
  id: number;
  nombre: string;
  direccion: string;
  total_unidades: number;
}

export function EdificiosPage() {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEdificios();
  }, []);

  const fetchEdificios = async () => {
    try {
      setLoading(true);
      const response = await edificioService.getAll();
      setEdificios(response.data);
    } catch (err) {
      setError('Error al cargar edificios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edificios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {edificios.map(edificio => (
          <EdificioCard key={edificio.id} edificio={edificio} />
        ))}
      </div>
    </div>
  );
}
```

**Servicio API:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const edificioService = {
  getAll: () => api.get('/edificios'),
  getById: (id: number) => api.get(`/edificios/${id}`),
  create: (data: any) => api.post('/edificios', data),
  update: (id: number, data: any) => api.put(`/edificios/${id}`, data),
  delete: (id: number) => api.delete(`/edificios/${id}`),
};
```

---

## 4. Trabajar con la Base de Datos

### 4.1 Crear Migración

```bash
php artisan make:migration create_nueva_tabla_table
```

```php
public function up(): void
{
    Schema::create('nueva_tabla', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
        $table->foreignId('edificio_id')->constrained()->cascadeOnDelete();
        $table->string('nombre', 200);
        $table->decimal('monto', 12, 2)->default(0);
        $table->enum('estado', ['activo', 'inactivo'])->default('activo');
        $table->timestamps();
        $table->softDeletes();
        
        $table->index(['tenant_id', 'edificio_id']);
    });
}
```

### 4.2 Crear Modelo

```bash
php artisan make:model NuevaTabla
```

```php
class NuevaTabla extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'nueva_tabla';

    protected $fillable = [
        'tenant_id',
        'edificio_id',
        'nombre',
        'monto',
        'estado',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    // Relaciones
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function edificio(): BelongsTo
    {
        return $this->belongsTo(Edificio::class);
    }

    // Scopes
    public function scopeActivo($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeDelTenant($query, $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }
}
```

### 4.3 Crear Seeder

```bash
php artisan make:seeder NuevaTablaSeeder
```

```php
class NuevaTablaSeeder extends Seeder
{
    public function run(): void
    {
        $datos = [
            ['nombre' => 'Item 1', 'monto' => 100000],
            ['nombre' => 'Item 2', 'monto' => 200000],
        ];

        foreach ($datos as $dato) {
            NuevaTabla::create([
                'tenant_id' => 1,
                'edificio_id' => 1,
                ...$dato
            ]);
        }
    }
}
```

---

## 5. Crear Nuevo Endpoint API

### 5.1 Crear Controlador

```bash
php artisan make:controller Api/NuevaTablaController --api
```

### 5.2 Definir Rutas

En `routes/api.php`:
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('nueva-tabla', NuevaTablaController::class);
    Route::post('nueva-tabla/{id}/accion-especial', [NuevaTablaController::class, 'accionEspecial']);
});
```

### 5.3 Crear Form Request

```bash
php artisan make:request StoreNuevaTablaRequest
```

### 5.4 Probar Endpoint

```bash
# Con httpie
http POST localhost:8000/api/nueva-tabla \
  Authorization:"Bearer $TOKEN" \
  nombre="Test" \
  monto:=150000

# Con curl
curl -X POST http://localhost:8000/api/nueva-tabla \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Test", "monto": 150000}'
```

---

## 6. Crear Nueva Página Frontend

### 6.1 Crear Archivo de Página

`src/pages/NuevaTablaPage.tsx`:
```tsx
import { useState, useEffect } from 'react';
import { nuevaTablaService } from '../services/api';

export function NuevaTablaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await nuevaTablaService.getAll();
      setItems(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Nueva Tabla</h1>
      {/* contenido */}
    </div>
  );
}
```

### 6.2 Agregar Ruta

En `src/App.tsx`:
```tsx
import { NuevaTablaPage } from './pages/NuevaTablaPage';

// En el router
<Route path="/nueva-tabla" element={<NuevaTablaPage />} />
```

### 6.3 Agregar al Menú

En `src/components/layout/Sidebar.tsx`:
```tsx
const menuItems = [
  // ...otros items
  { path: '/nueva-tabla', label: 'Nueva Tabla', icon: IconName },
];
```

---

## 7. Generar PDFs

### 7.1 Crear Plantilla Blade

`resources/views/pdf/documento.blade.php`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $titulo }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; }
        .table th { background: #f5f5f5; }
        .total { font-weight: bold; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $titulo }}</h1>
        <p>{{ $edificio->nombre }}</p>
    </div>
    
    <table class="table">
        <thead>
            <tr>
                <th>Concepto</th>
                <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item->nombre }}</td>
                <td class="total">${{ number_format($item->monto, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
```

### 7.2 Generar PDF en Controlador

```php
use Barryvdh\DomPDF\Facade\Pdf;

public function generarPdf($id)
{
    $documento = Documento::findOrFail($id);
    
    $pdf = Pdf::loadView('pdf.documento', [
        'titulo' => 'Mi Documento',
        'edificio' => $documento->edificio,
        'items' => $documento->items,
    ]);

    return $pdf->download("documento-{$id}.pdf");
}
```

---

## 8. Testing

### 8.1 Tests de Feature (API)

```bash
php artisan make:test EdificioTest
```

```php
class EdificioTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_listar_edificios(): void
    {
        $user = User::factory()->create();
        Edificio::factory()->count(5)->create(['tenant_id' => $user->tenant_id]);

        $response = $this->actingAs($user)
            ->getJson('/api/edificios');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_puede_crear_edificio(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/edificios', [
                'nombre' => 'Edificio Test',
                'rut' => '76.123.456-7',
                'direccion' => 'Calle 123',
                'comuna' => 'Santiago',
                'tipo' => 'condominio',
                'total_unidades' => 50,
            ]);

        $response->assertStatus(201)
            ->assertJson(['nombre' => 'Edificio Test']);
    }
}
```

### 8.2 Ejecutar Tests

```bash
# Todos los tests
php artisan test

# Tests específicos
php artisan test --filter=EdificioTest

# Con coverage
php artisan test --coverage
```

---

## 9. Comandos Útiles

### 9.1 Artisan

```bash
# Limpiar cachés
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimizar para producción
php artisan optimize

# Ver rutas
php artisan route:list
php artisan route:list --path=api/edificios

# Crear recursos
php artisan make:model NuevoModelo -mcr  # Modelo + Migration + Controller Resource
php artisan make:controller Api/NuevoController --api
php artisan make:request NuevoRequest
php artisan make:middleware NuevoMiddleware

# Base de datos
php artisan migrate:fresh --seed  # Recrear BD completa
php artisan db:seed --class=SeederEspecifico

# Queue
php artisan queue:work
php artisan queue:failed  # Ver jobs fallidos
php artisan queue:retry all  # Reintentar fallidos
```

### 9.2 Composer

```bash
composer install          # Instalar dependencias
composer update           # Actualizar dependencias
composer dump-autoload    # Regenerar autoload
composer require paquete  # Agregar paquete
```

### 9.3 NPM

```bash
npm install               # Instalar dependencias
npm run dev               # Servidor desarrollo
npm run build             # Build producción
npm run lint              # Verificar código
npm run preview           # Preview del build
```

---

## 10. Debugging

### 10.1 Laravel

```php
// En código
dd($variable);           // Dump and die
dump($variable);         // Solo dump
logger($mensaje);        // Log a archivo
info($mensaje);          // Log nivel info

// En .env
APP_DEBUG=true
LOG_LEVEL=debug
```

### 10.2 Logs

```bash
# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Limpiar logs
truncate -s 0 storage/logs/laravel.log
```

### 10.3 Telescope (Desarrollo)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Acceder a `/telescope` para ver requests, queries, jobs, etc.

---

## 11. Git Workflow

### 11.1 Branches

```
main            # Producción
├── develop     # Desarrollo
    ├── feature/nueva-funcionalidad
    ├── bugfix/correccion-error
    └── hotfix/fix-urgente
```

### 11.2 Commits

```bash
# Formato
tipo(alcance): descripción corta

# Tipos
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Documentación
style:    Formato (no afecta código)
refactor: Refactorización
test:     Tests
chore:    Mantenimiento

# Ejemplos
feat(edificios): agregar filtro por comuna
fix(boletas): corregir cálculo de intereses
docs(api): documentar endpoint de distribución
```

### 11.3 Pull Requests

1. Crear branch desde `develop`
2. Desarrollar funcionalidad
3. Ejecutar tests localmente
4. Crear PR hacia `develop`
5. Code review
6. Merge

---

*Guía de Desarrollo v2.5 - Diciembre 2025*  
*© DATAPOLIS SpA*
