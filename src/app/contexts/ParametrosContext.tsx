import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Producto } from '@/data/mock/tipos'

export interface Parametros {
  // Retenciones por producto (fracción, ej: 0.24 = 24%)
  retenciones: Record<Producto, number>

  // Flete
  fleteBase: number       // USD/tn hasta 100km
  fletePorKm: number      // USD/tn/km adicional más allá de 100km

  // Puerto
  gastosPuerto: number    // USD/tn (fobbing, despachante, etc.)

  // Corredor
  comisionPorc: number    // fracción, ej: 0.015 = 1.5%

  // Calidad
  humedadStd: Record<Producto, number>   // % de humedad estándar por grano
  secadoPorPorcentaje: number            // costo secado como fracción del FAS por % de exceso
  zarandeo: number                       // USD/tn fijo

  // Metadata
  vigencia: string  // YYYY-MM-DD
}

export const PARAMETROS_DEFAULT: Parametros = {
  retenciones: {
    soja:    0.240,
    maiz:    0.085,
    trigo:   0.055,
    girasol: 0.085,
    sorgo:   0.085,
    cebada:  0.055,
  },
  fleteBase: 8.0,
  fletePorKm: 0.055,
  gastosPuerto: 10.0,
  comisionPorc: 0.015,
  humedadStd: {
    soja:    13.0,
    maiz:    14.0,
    trigo:   10.5,
    girasol:  9.0,
    sorgo:   13.0,
    cebada:  12.0,
  },
  secadoPorPorcentaje: 0.011,
  zarandeo: 1.0,
  vigencia: '2026-01-01',
}

interface ParametrosCtx {
  parametros: Parametros
  setParametros: (p: Parametros) => void
  resetParametros: () => void
}

const Ctx = createContext<ParametrosCtx | null>(null)

export function ParametrosProvider({ children }: { children: ReactNode }) {
  const [parametros, setParametrosState] = useState<Parametros>(() => {
    try {
      const stored = localStorage.getItem('grainflow_parametros')
      return stored ? { ...PARAMETROS_DEFAULT, ...JSON.parse(stored) } : PARAMETROS_DEFAULT
    } catch {
      return PARAMETROS_DEFAULT
    }
  })

  const setParametros = (p: Parametros) => {
    setParametrosState(p)
    localStorage.setItem('grainflow_parametros', JSON.stringify(p))
  }

  const resetParametros = () => setParametros(PARAMETROS_DEFAULT)

  return (
    <Ctx.Provider value={{ parametros, setParametros, resetParametros }}>
      {children}
    </Ctx.Provider>
  )
}

export function useParametros() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useParametros debe usarse dentro de ParametrosProvider')
  return ctx
}
