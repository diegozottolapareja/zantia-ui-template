import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function UpdateBanner() {
  const [dismissed, setDismissed] = useState(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every 60 minutes when app is in background
      if (r) setInterval(() => r.update(), 60 * 60 * 1000)
    },
  })

  const visible = needRefresh && !dismissed

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-primary text-white px-4 py-3 flex items-center justify-between gap-3 shadow-lg"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            <span>Nueva versión disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1.5 bg-white text-primary rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors"
            >
              Actualizar
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
