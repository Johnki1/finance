# Plan — Monorepo Finance

Estado actual post-auditoría Fase 1 y saneamiento parcial Fase 2.

## Módulos
- `backend/` — Spring Boot 3.5 / Java 21 / PostgreSQL / Flyway / JWT.
- `frontend/` — React + Vite + TypeScript.
- `mobile/` — Expo / React Native / Expo Router / Zustand / Axios / SecureStore.
- `packages/shared/` — Tipos, utilidades y constantes compartidas.

## Auditoría completada
- Se eliminó duplicación confirmada sin referencias: `mobile/src/types/income.ts`.
- Se consolidaron tipos de resumen financiero en `packages/shared/src/types/common.ts`.
- Se verificó compilación de backend, typecheck de mobile y typecheck de frontend.
- No se modificaron contratos congelados.

## Tipos duplicados detectados

| Tipo | Ubicación duplicada | Acción | Razón |
|------|---------------------|--------|-------|
| `IncomeRequest` / `IncomeResponse` | `mobile/src/types/income.ts` vs `packages/shared/src/types/income.ts` | Eliminado de mobile | Duplicación exacta; mobile ya importa desde shared |
| `FinanceSummaryResponse` | `mobile/src/types/finance.ts` vs `packages/shared/src/types/common.ts` | Eliminado de mobile | Duplicación exacta; movido a shared |
| `QuarterlyReportResponse` | `frontend/src/types.ts` vs `packages/shared/src/types/common.ts` | Conservado en ambos | Frontend aún no consume shared; bajo riesgo |
| `AuthRequest` / `AuthResponse` | `mobile/src/types/auth.ts` vs `packages/shared/src/types/auth.ts` | Conservado en mobile | Contrato congelado; no unificar sin validación completa |
| `FixedExpense*` / `VariableExpense*` | `mobile/src/services/*Service.ts` vs `packages/shared/src/types/expense.ts` | Conservado en mobile por ahora | Duplicación parcial; requiere migración controlada |

## Estado de fases
- Fase 1: Completada — Auditoría inicial y eliminación de duplicaciones confirmadas.
- Fase 2: Completada — Limpieza profunda y consolidación de tipos en `packages/shared`.
- Fase 3: Completada — `.gitignore` unificado, `.env.example` por módulo y saneamiento de artefactos generados.
- Fase 4: Completada — Inicialización de Git, commit inicial, remote configurado y push completado.

## Próximas fases sugeridas
- Fase 5: Diseño de infraestructura Azure.
