// ─── Single source of truth para configuración del template ───────────────────
// Cloná este template → editá este archivo → 80% de la customización lista.

export const appConfig = {
  // ── Branding ─────────────────────────────────────────────────────────────
  APP_NAME: 'ORIGEN',
  APP_TAGLINE: 'Gestión de clases, profesores y alumnos',
  LOGO_URL: '/logo.svg',

  // ── Entidad principal del negocio ────────────────────────────────────────
  ENTITY_NAME_SINGULAR: 'Clase',
  ENTITY_NAME_PLURAL: 'Clases',

  // ── Links externos ───────────────────────────────────────────────────────
  WHATSAPP_URL: 'https://wa.me/',
  SUPPORT_EMAIL: '',
  INSTAGRAM_URL: '',
  LINKEDIN_URL: '',

  // ── Roles (labels visuales) ───────────────────────────────────────────────
  ROLES: {
    superAdmin: 'Super Admin',
    admin:      'Administrador',
    profesor:   'Profesor',
    manager:    'Manager',
    visitor:    'Visitante',
  } as const,

  // ── Demo mode ────────────────────────────────────────────────────────────
  DEMO_MODE: true,

  // ── BI Charts embebidos ───────────────────────────────────────────────────
  BI_CHARTS: [
    { id: 'occupancy-overview',  section: 'reports', name: 'Ocupación General',      url: '' },
    { id: 'revenue-monthly',     section: 'reports', name: 'Facturación Mensual',    url: '' },
    { id: 'top-professors',      section: 'reports', name: 'Ranking Profesores',     url: '' },
  ] as const,

  // ── Feature flags ────────────────────────────────────────────────────────
  FEATURES: {
    NOTIFICATIONS:       true,
    DARK_MODE:           true,
    PWA_INSTALL_PROMPT:  true,
    BIOMETRIC_LOGIN:     true,
    AI_CHAT:             false,   // no activo en fitness aún
  },
} as const

export type Role = keyof typeof appConfig.ROLES
export type BIChartId = (typeof appConfig.BI_CHARTS)[number]['id']
