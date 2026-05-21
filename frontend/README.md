# Frontend - CodeFlow Start

Frontend de la plataforma educativa CodeFlow Start, construido con React, TanStack Start, TanStack Router, Vite, TypeScript y Tailwind CSS.

## Version de React

- Version declarada en `package.json`: `^19.2.0`
- Version resuelta en `package-lock.json`: `19.2.6`
- `react-dom` tambien esta resuelto en `19.2.6`

## Requisitos

- Node.js instalado
- npm instalado
- Backend Laravel corriendo, por defecto en `http://127.0.0.1:8000`

El proyecto tambien incluye `bun.lock`, pero como existe `package-lock.json`, los comandos principales de este README usan npm.

## Instalacion

Desde la raiz del repositorio:

```bash
cd frontend
npm install
```

## Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Variable disponible:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Esta URL debe apuntar al API del backend Laravel. Si el backend corre en otro host o puerto, actualiza `VITE_API_URL`.

## Scripts disponibles

```bash
npm run dev
```

Levanta el servidor de desarrollo con Vite.

```bash
npm run build
```

Genera la version de produccion.

```bash
npm run build:dev
```

Genera una build usando el modo `development`.

```bash
npm run preview
```

Sirve localmente la build generada para revisarla.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

```bash
npm run format
```

Formatea el codigo con Prettier.

## Estructura principal

```text
frontend/
  src/
    components/ui/   Componentes reutilizables de interfaz
    context/         Contextos de autenticacion y aprendizaje
    data/            Datos locales del frontend
    hooks/           Hooks reutilizables
    layouts/         Layout principal de la aplicacion
    lib/             Cliente API y utilidades
    routes/          Rutas de TanStack Router
    types/           Tipos TypeScript compartidos
```

## Rutas y funcionalidades

La aplicacion usa TanStack Router con rutas basadas en archivos. Entre las pantallas principales estan:

- `/login`: inicio de sesion
- `/register`: registro de usuarios
- `/inicio`: vista principal
- `/dashboard`: panel del usuario
- `/cursos`: cursos disponibles
- `/leccion/:id`: detalle de leccion
- `/retos`: retos
- `/logros`: logros
- `/perfil`: perfil del usuario
- `/tutor`: tutor IA

La ruta `/` redirige a `/inicio` si el usuario esta autenticado o a `/login` si no lo esta.

## Conexion con el backend

El cliente HTTP esta en `src/lib/api.ts`. Usa `VITE_API_URL` como base y guarda el token de sesion en `localStorage` con la clave `codeflow_token`.

Endpoints usados por el frontend:

- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /me`
- `PUT /me`
- `GET /learning`
- `POST /lessons/:id/complete`
- `POST /challenges/:id/complete`
- `POST /tutor/reply`

## Build y despliegue

El proyecto esta configurado con TanStack Start y Vite. Tambien incluye configuracion para Cloudflare Workers mediante `wrangler.jsonc`.

Para generar una build:

```bash
npm run build
```

Para revisar la build localmente:

```bash
npm run preview
```

## Notas de desarrollo

- Los estilos globales estan en `src/styles.css`.
- La configuracion de Vite esta centralizada en `vite.config.ts` usando `@lovable.dev/vite-tanstack-config`.
- El arbol de rutas generado esta en `src/routeTree.gen.ts`.
- Si agregas o cambias rutas, revisa que TanStack Router regenere correctamente el arbol de rutas.
