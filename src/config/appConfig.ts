// ─── Single source of truth para configuración del template ───────────────────
// Cloná este template → editá este archivo → 80% de la customización lista.
// Sin secretos aquí. Las credenciales van en .env.local (nunca commiteado).
//
// Ver también:
//   rolesConfig.ts      — roles, permisos, módulos por rol
//   modulesConfig.ts    — módulos habilitados
//   navigationConfig.ts — nav items por rol
//   themeConfig.ts      — referencia de colores (los valores reales en theme.css)
//   entityConfig.ts     — schema de la entidad principal

export const appConfig = {
  // ── Branding ─────────────────────────────────────────────────────────────
  APP_NAME: 'Grainflow',
  APP_TAGLINE: 'Calculadora de márgenes en base a las diferentes variables',
  LOGO_URL: '/logo.svg',

  // ── Entidad principal del negocio ────────────────────────────────────────
  // Usados en labels, placeholders y mensajes genéricos de la UI.
  // Ejemplos por rubro:
  //   granos:       'Grano'      / 'Granos'
  //   gimnasio:     'Clase'      / 'Clases'
  //   inmobiliaria: 'Propiedad'  / 'Propiedades'
  //   turismo:      'Servicio'   / 'Servicios'
  ENTITY_NAME_SINGULAR: 'Grano',
  ENTITY_NAME_PLURAL: 'Granos',

  // ── Links externos ───────────────────────────────────────────────────────
  WHATSAPP_URL: 'https://wa.me/',   // e.g. 'https://wa.me/5491112345678'
  SUPPORT_EMAIL: '',
  INSTAGRAM_URL: '',
  LINKEDIN_URL: '',

  // ── Roles (labels visuales — las keys vienen de rolesConfig.ts) ──────────
  // Mantener sincronizado con rolesConfig.ts.
  // La app usa las KEYS internamente, estos labels solo se muestran en UI.
  ROLES: {
    superAdmin: 'Super Admin',
    admin: 'Administrador',
    corredor: 'Operativo',     // antes: 'Corredor' — Fase 3: renombrar key a 'operative'
    comprador: 'Cliente',      // antes: 'Comprador' — Fase 3: renombrar key a 'customer'
    visitor: 'Visitante',
  } as const,

  // ── Demo mode ────────────────────────────────────────────────────────────
  // Muestra el selector de roles en login sin credenciales reales.
  // Seguro para commitear. Apagarlo en producción desde el panel de superAdmin.
  DEMO_MODE: true,

  // ── BI Charts embebidos (Looker Studio, Metabase, etc.) ──────────────────
  // Usar <BIChart id="sales-overview" /> en cualquier página — la URL vive solo aquí.
  BI_CHARTS: [
    {
      id: 'sales-overview',
      section: 'admin-analytics',
      name: 'Ventas Generales',
      url: '',   // pegar URL de embed de Looker Studio aquí
    },
    {
      id: 'seller-performance',
      section: 'admin-analytics',
      name: 'Rendimiento Operativos',
      url: '',
    },
    {
      id: 'inventory-status',
      section: 'admin-analytics',
      name: 'Estado de Inventario',
      url: '',
    },
  ] as const,

  // ── Feature flags ────────────────────────────────────────────────────────
  FEATURES: {
    NOTIFICATIONS: true,
    DARK_MODE: true,
    PWA_INSTALL_PROMPT: true,
    BIOMETRIC_LOGIN: true,
    AI_CHAT: true,
  },
} as const

export type Role = keyof typeof appConfig.ROLES
export type BIChartId = (typeof appConfig.BI_CHARTS)[number]['id']
