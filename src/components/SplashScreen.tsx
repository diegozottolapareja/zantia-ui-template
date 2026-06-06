import { motion } from 'motion/react'

interface SplashScreenProps {
  logo: string
  appName?: string
  tagline?: string
}

export function SplashScreen({ logo, appName, tagline }: SplashScreenProps) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center z-10"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <img
          src={logo}
          alt={appName ?? 'Logo'}
          className="w-80 h-auto mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-3xl"
        />
      </motion.div>
      {tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/50 text-sm tracking-[0.3em] uppercase"
        >
          {tagline}
        </motion.p>
      )}
    </motion.div>
  )
}
