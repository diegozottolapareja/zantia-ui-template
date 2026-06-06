// ─── Single source of truth for all template configuration ───────────────────
// Clone this template → edit this file → you're 80% done customizing the project.
// No secrets here. Credentials live in .env.local (never committed).

export const appConfig = {
  // ── Branding ─────────────────────────────────────────────────────────────
  APP_NAME: 'Grainflow',
  APP_TAGLINE: 'Calculadora de márgenes en base a las diferentes variables',
  LOGO_URL: '/logo.svg',

  // ── Catalog entity names (shown in UI labels, placeholders, messages) ────
  ITEM_NAME_SINGULAR: 'Grano',
  ITEM_NAME_PLURAL: 'Granos',

  // ── Contact ───────────────────────────────────────────────────────────────
  WHATSAPP_URL: 'https://wa.me/',   // e.g. 'https://wa.me/5491112345678'

  // ── Roles (display names shown in UI — code always uses the key) ──────────
  ROLES: {
    superAdmin: 'Super Admin',
    admin: 'Administrador',
    corredor: 'Corredor',
    comprador: 'Comprador',
    visitor: 'Visitante',
  } as const,

  // ── Demo mode — bypasses auth, shows role selector on login ──────────────
  // Safe to commit. Toggle in superAdmin panel in production without redeploy.
  DEMO_MODE: true,

  // ── Embedded BI charts (Looker Studio, Metabase, etc.) ───────────────────
  // Use <BIChart id="sales-overview" /> in any page — URL lives here only.
  BI_CHARTS: [
    {
      id: 'sales-overview',
      section: 'admin-analytics',
      name: 'Ventas Generales',
      url: '',   // paste Looker Studio embed URL here
    },
    {
      id: 'seller-performance',
      section: 'admin-analytics',
      name: 'Rendimiento Vendedores',
      url: '',
    },
    {
      id: 'inventory-status',
      section: 'admin-analytics',
      name: 'Estado de Inventario',
      url: '',
    },
  ] as const,
} as const

export type Role = keyof typeof appConfig.ROLES
export type BIChartId = (typeof appConfig.BI_CHARTS)[number]['id']
