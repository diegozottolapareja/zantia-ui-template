# GrainFlowPro → Template Base

Este proyecto está siendo refactorizado de una app de granos a un **template genérico
single-tenant, mobile-first, PWA-ready** reutilizable para múltiples rubros.

## Stack

- React 18 + TypeScript + Vite 6
- React Router 7
- Tailwind CSS v4 (sin tailwind.config.js, configurado via `@tailwindcss/vite`)
- shadcn/ui (Radix UI + class-variance-authority) — 54 componentes en `src/app/components/ui/`
- Sonner (toasts), Motion (animaciones), Lucide (iconos)
- VitePWA + Workbox (service worker, offline, install/update banners)
- Supabase JS disponible (sin modelos definidos aún)

## Estructura

```
src/
  config/           ← configuración centralizada (editar aquí para customizar)
    appConfig.ts    ← branding, entity names, roles, demo mode, BI charts
    rolesConfig.ts  ← roles + permisos + módulos + defaultRoute por rol
    modulesConfig.ts← módulos habilitados y sus rutas
    navigationConfig.ts ← nav items por rol (leído por BottomNav y PrivateRoute)
    themeConfig.ts  ← paleta de colores configurable
    entityConfig.ts ← schema de entidad principal (campos, estados, columnas)
  app/
    App.tsx         ← router principal (22 rutas organizadas por rol)
    contexts/
      AuthContext.tsx      ← auth state, can(), session localStorage, WebAuthn scaffold
      ParametrosContext.tsx← parámetros de pricing (específico de granos, mover a módulo en Fase 4)
    components/
      PrivateRoute.tsx     ← protección de rutas, lee defaultRoute desde navigationConfig
      RoleGuard.tsx        ← guard por rol (UI elements)
      PermissionGuard.tsx  ← guard por permiso (preferir sobre RoleGuard en código nuevo)
      ui/                  ← 54 componentes shadcn/ui (no tocar)
    pages/          ← páginas por rol (aún con nombres de dominio granos — Fase 3)
  components/       ← componentes compartidos genéricos
    AppHeader.tsx, BottomNav.tsx, BIChart.tsx, KPICard.tsx, ItemCard.tsx
    EmptyState.tsx, LoadingDots.tsx, SplashScreen.tsx
    InstallBanner.tsx, UpdateBanner.tsx, OfflineBanner.tsx
  lib/
    api.ts          ← wrapper HTTP genérico (GET/POST/PUT/PATCH/DELETE) — no tocar
    calculator.ts   ← lógica de márgenes de granos (mover a módulo en Fase 4)
  data/mock/        ← datos demo (específicos de granos, mover a módulo en Fase 4)
  styles/
    theme.css       ← variables CSS (primary, surface-dark, etc.) — editar para cambiar colores
```

## Configuración — cómo customizar para un nuevo rubro

1. Editar `src/config/appConfig.ts` — nombre, logo, tagline, entidad principal
2. Editar `src/config/rolesConfig.ts` — roles disponibles, permisos, módulos, ruta default
3. Editar `src/config/navigationConfig.ts` — nav items por rol
4. Editar `src/config/modulesConfig.ts` — módulos activos
5. Editar `src/config/entityConfig.ts` — campos y estados de la entidad principal
6. Editar `src/styles/theme.css` — colores primarios (`--primary`, `--accent`, `--surface-dark`)
7. Reemplazar `public/logo.svg` y `public/manifest.json`

## RBAC — cómo verificar permisos

```tsx
// En componentes — preferir PermissionGuard sobre RoleGuard para código nuevo
import { PermissionGuard } from '@/app/components/PermissionGuard'
<PermissionGuard permission="entities:write">
  <EditButton />
</PermissionGuard>

// En hooks — preferir can() sobre checar user.role directamente
const { can } = useAuth()
if (can('users:manage')) { ... }
```

## Estado de refactorización

| Fase | Estado | Descripción |
|------|--------|-------------|
| Fase 0 | ✅ | Git snapshot + CLAUDE.md |
| Fase 1 | ✅ | Config centralizada (rolesConfig, modulesConfig, navigationConfig, themeConfig, entityConfig) |
| Fase 2 | ✅ | can() en AuthContext, PermissionGuard, PrivateRoute lee navigationConfig |
| Fase 3 | ⏳ | Renombrar páginas y componentes de dominio |
| Fase 4 | ⏳ | Aislar lógica de granos en `src/modules/grains/` |
| Fase 5 | ⏳ | EntityList/EntityCard/EntityForm genéricos + mock data genérica |
| Fase 6 | ⏳ | PWA polish, manifest dinámico, safe areas |

## Convenciones

- **No usar `user.role === 'corredor'`** en código nuevo — usar `can(permission)` o `PermissionGuard`
- **No hardcodear rutas de default por rol** — leer de `navigationConfig.getDefaultRoute(role)`
- **No importar mock data en páginas nuevas** — usar la capa de servicios en `lib/api.ts`
- Todos los commits van en español o inglés técnico neutro
- Styles: Tailwind utility classes + CSS variables de `theme.css` — nunca inline styles
