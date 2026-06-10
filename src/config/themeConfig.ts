// ─── Configuración de tema ────────────────────────────────────────────────────
// Los valores reales de color viven en src/styles/theme.css como variables CSS.
// Este archivo sirve como referencia y documentación de qué cambiar.
//
// Para customizar colores:
//   1. Editar src/styles/theme.css — variables :root (modo claro) y .dark (modo oscuro)
//   2. Los colores de referencia de abajo deben mantenerse sincronizados si los usás en JS
//
// Variables CSS clave (ver theme.css):
//   --primary          → color principal de la marca (botones, links, highlights)
//   --accent           → variante del color principal
//   --surface-dark     → fondo oscuro del header y pantalla de login
//   --surface-dark-mid → gradiente medio del header oscuro

export const themeConfig = {
  // Modo claro
  light: {
    primary: '#2e7d32',       // Verde corporativo → cambiar por color de marca
    accent: '#388e3c',
    surfaceDark: '#0d2b0d',
    surfaceDarkMid: '#1a4a1a',
  },

  // Modo oscuro
  dark: {
    primary: '#9333ea',       // Púrpura → cambiar por color de marca en modo oscuro
    accent: '#8b2e5f',
    surfaceDark: '#1a0a2e',
    surfaceDarkMid: '#2d1548',
  },

  // Geometría
  radius: '0.75rem',          // Border radius base (--radius en theme.css)
  fontBase: 16,               // Font size base en px (--font-size en theme.css)
} as const
