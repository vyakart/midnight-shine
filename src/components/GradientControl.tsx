import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGradient, type GradientPreset } from '../contexts/GradientContext'

const presetIcons: Record<GradientPreset, string> = {
  aurora: '🌌',
  sunset: '🌅',
  ocean: '🌊',
  forest: '🌲',
  cosmic: '🪐',
  psychedelic: '🌈',
  minimal: '⚪',
  dynamic: '✨'
}

const presetNames: Record<GradientPreset, string> = {
  aurora: 'Aurora',
  sunset: 'Sunset',
  ocean: 'Ocean',
  forest: 'Forest',
  cosmic: 'Cosmic',
  psychedelic: 'Psychedelic',
  minimal: 'Minimal',
  dynamic: 'Dynamic'
}

export const GradientControl: React.FC = () => {
  const { 
    currentPreset, 
    setPreset, 
    isAnimated, 
    toggleAnimation, 
    gradientConfig,
    primaryColor,
    backgroundColor
  } = useGradient()
  const [isOpen, setIsOpen] = useState(false)

  const presets: GradientPreset[] = [
    'cosmic', 'psychedelic', 'aurora', 'sunset', 
    'ocean', 'forest', 'minimal', 'dynamic'
  ]

  return (
    <div className="relative">
      {/* Main Control Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-12 h-12 rounded-full p-2
          backdrop-blur-md border border-white/20
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-white/30
          overflow-hidden group
        `}
                 style={{
           background: `linear-gradient(135deg, var(--gradient-primary), var(--gradient-secondary))`,
           boxShadow: `0 4px 20px ${primaryColor || '#8b5cf6'}40`
         }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Gradient Controls"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle, var(--gradient-accent), transparent)`
          }}
          animate={{
            rotate: isAnimated ? 360 : 0,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Icon */}
        <motion.span
          className="relative z-10 text-xl flex items-center justify-center w-full h-full"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {presetIcons[currentPreset]}
        </motion.span>
      </motion.button>

      {/* Controls Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
              absolute bottom-16 right-0 min-w-64 p-4 rounded-2xl
              backdrop-blur-xl border border-white/20
              shadow-2xl z-50
            `}
                         style={{
               background: `linear-gradient(135deg, 
                 ${backgroundColor || '#0f0f0f'}dd,
                 ${primaryColor || '#8b5cf6'}22
               )`
             }}
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">
                Gradient Control
              </h3>
              <p className="text-sm text-white/70">
                Current: {presetNames[currentPreset]}
              </p>
            </div>

            {/* Animation Toggle */}
            <div className="mb-4 p-3 rounded-xl bg-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">
                  Animation
                </span>
                <motion.button
                  onClick={toggleAnimation}
                  className={`
                    relative w-12 h-6 rounded-full p-1
                    transition-colors duration-300
                    ${isAnimated ? 'bg-white/30' : 'bg-white/10'}
                  `}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`
                      w-4 h-4 rounded-full
                      ${isAnimated ? 'bg-white' : 'bg-white/50'}
                    `}
                    animate={{ x: isAnimated ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
              {isAnimated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-xs text-white/60"
                >
                  Speed: {gradientConfig.speed}x • Intensity: {gradientConfig.intensity}
                </motion.div>
              )}
            </div>

            {/* Preset Grid */}
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => (
                <motion.button
                  key={preset}
                  onClick={() => setPreset(preset)}
                  className={`
                    aspect-square rounded-xl p-2 text-lg
                    backdrop-blur-sm border border-white/20
                    transition-all duration-300
                    ${currentPreset === preset 
                      ? 'bg-white/30 border-white/50 scale-105' 
                      : 'bg-white/10 hover:bg-white/20'
                    }
                  `}
                  whileHover={{ scale: currentPreset === preset ? 1.05 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={presetNames[preset]}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base">
                      {presetIcons[preset]}
                    </span>
                    <span className="text-xs text-white/70 leading-none">
                      {presetNames[preset].slice(0, 4)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-xs text-white/60 text-center">
                Dynamic gradient system powered by WebGL
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 -z-10 backdrop-blur-sm"
            style={{ marginTop: '-100vh', marginLeft: '-100vw', width: '300vw', height: '300vh' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 