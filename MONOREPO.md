# Monorepo Finance

Estructura del proyecto:

- `backend/` — Spring Boot API REST.
- `frontend/` — React + Vite.
- `packages/shared/` — Tipos, utilidades y constantes compartidas.
- `mobile/` — Expo + React Native.

Workspaces configurados en `package.json` raíz.
Alias `@finance/shared` resuelto desde `packages/shared/src`.

## Configuración de entorno

Cada módulo incluye un archivo `.env.example` con variables requeridas:

- `backend/.env.example`
- `frontend/.env.example`
- `mobile/.env.example`

Los valores reales deben definirse en archivos `.env` locales excluidos de Git.
