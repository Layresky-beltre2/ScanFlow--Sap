# ScanFlow - SAP

Portal web para gestión de códigos de barra de artículos de inventario en SAP Business One.

## Tecnología utilizada
- **Frontend:** React + Vite
- **Backend:** Node.js + Express (servidor proxy)
- **Librería QR:** qrcode.react

## Requisitos previos
- Node.js instalado
- Acceso a la red donde está el SAP Business One Service Layer

## Instalación

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Ejecución

### Terminal 1 - Backend
```bash
cd backend
node server.js
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

## Configuración
- La URL del Service Layer está configurada en `frontend/src/api/sapApi.js`
- El usuario ingresa sus credenciales de SAP en el login (CompanyDB, Username, Password)
- No se requiere archivo .env

## Funcionalidades implementadas
- ✅ Login con SAP Business One (Service Layer)
- ✅ Logout
- ✅ Listado de artículos de inventario
- ✅ Búsqueda por código, nombre o barcode
- ✅ Paginación de artículos
- ✅ Visualización de barcode principal en tabla
- ✅ Generación de código QR por barcode
- ✅ Detalle del artículo (código, nombre, grupo, status)
- ✅ Ver todos los códigos de barra con su QR y UOM
- ✅ Agregar nuevo código de barra con unidad de medida
- ✅ Validación de campos y duplicados
- ✅ Manejo de errores y mensajes al usuario

## Endpoints utilizados
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /b1s/v2/Login | Iniciar sesión en SAP |
| POST | /b1s/v2/Logout | Cerrar sesión |
| GET | /b1s/v2/Items | Listar artículos de inventario |
| GET | /b1s/v2/Items('{ItemCode}') | Detalle de un artículo |
| PATCH | /b1s/v2/Items('{ItemCode}') | Agregar nuevo barcode |

## Estructura del proyecto