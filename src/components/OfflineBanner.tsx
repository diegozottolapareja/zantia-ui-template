import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gray-900 text-white px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        >
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>Sin conexión — mostrando datos guardados</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
