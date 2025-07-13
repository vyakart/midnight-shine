import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type GradientPreset = 
  | 'aurora' 
  | 'sunset' 
  | 'ocean' 
  | 'forest' 
  | 'cosmic' 
  | 'psychedelic'
  | 'minimal'
  | 'dynamic'

interface GradientConfig {
  name: string
  primary: string[]
  secondary: string[]
  accent: string[]
  background: string[]
  speed: number
  intensity: number
}

interface GradientContextType {
  currentPreset: GradientPreset
  setPreset: (preset: GradientPreset) => void
  gradientConfig: GradientConfig
  isAnimated: boolean
  toggleAnimation: () => void
  time: number
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
}

const gradientPresets: Record<GradientPreset, GradientConfig> = {
  aurora: {
    name: 'Aurora',
    primary: ['#667eea', '#764ba2', '#f093fb'],
    secondary: ['#a8edea', '#fed6e3', '#d299c2'],
    accent: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    background: ['#0f0f23', '#1a1a2e', '#16213e'],
    speed: 2,
    intensity: 0.8
  },
  sunset: {
    name: 'Sunset',
    primary: ['#ff9a9e', '#fecfef', '#fecfef'],
    secondary: ['#ffc3a0', '#ffafbd', '#ff677d'],
    accent: ['#ff8a80', '#ff5722', '#e91e63'],
    background: ['#0a0a0a', '#1a0a1a', '#2a1a0a'],
    speed: 1.5,
    intensity: 0.9
  },
  ocean: {
    name: 'Ocean',
    primary: ['#667eea', '#764ba2', '#667eea'],
    secondary: ['#a8edea', '#fed6e3', '#a8edea'],
    accent: ['#4facfe', '#00f2fe', '#43e97b'],
    background: ['#0a1a2a', '#1a2a3a', '#0a2a1a'],
    speed: 1,
    intensity: 0.7
  },
  forest: {
    name: 'Forest',
    primary: ['#11998e', '#38ef7d', '#11998e'],
    secondary: ['#a8e6cf', '#88d8c0', '#a8e6cf'],
    accent: ['#4ecdc4', '#44a08d', '#093637'],
    background: ['#0a1a0a', '#1a2a1a', '#0a2a0a'],
    speed: 0.8,
    intensity: 0.6
  },
  cosmic: {
    name: 'Cosmic',
    primary: ['#8b5cf6', '#ec4899', '#3b82f6'],
    secondary: ['#c084fc', '#f472b6', '#60a5fa'],
    accent: ['#a855f7', '#f59e0b', '#10b981'],
    background: ['#0f0f0f', '#1a0f1a', '#0f1a1a'],
    speed: 3,
    intensity: 1
  },
  psychedelic: {
    name: 'Psychedelic',
    primary: ['#ff006e', '#8338ec', '#3a86ff'],
    secondary: ['#fb5607', '#ffbe0b', '#8338ec'],
    accent: ['#ff006e', '#fb5607', '#3a86ff'],
    background: ['#000000', '#0f0f0f', '#1a0a1a'],
    speed: 4,
    intensity: 1.2
  },
  minimal: {
    name: 'Minimal',
    primary: ['#6b7280', '#374151', '#6b7280'],
    secondary: ['#9ca3af', '#d1d5db', '#9ca3af'],
    accent: ['#3b82f6', '#1d4ed8', '#3b82f6'],
    background: ['#f9fafb', '#ffffff', '#f3f4f6'],
    speed: 0.5,
    intensity: 0.3
  },
  dynamic: {
    name: 'Dynamic',
    primary: ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b'],
    secondary: ['#fb5607', '#ff8500', '#8338ec', '#06ffa5', '#ffbe0b'],
    accent: ['#ff006e', '#fb5607', '#3a86ff', '#06ffa5', '#ffbe0b'],
    background: ['#000000', '#0f0f0f', '#1a0a1a', '#0a1a0f', '#1a1a0a'],
    speed: 5,
    intensity: 1.5
  }
}

const GradientContext = createContext<GradientContextType | undefined>(undefined)

export const useGradient = () => {
  const context = useContext(GradientContext)
  if (context === undefined) {
    throw new Error('useGradient must be used within a GradientProvider')
  }
  return context
}

interface GradientProviderProps {
  children: React.ReactNode
}

export const GradientProvider: React.FC<GradientProviderProps> = ({ children }) => {
  const [currentPreset, setCurrentPreset] = useState<GradientPreset>('cosmic')
  const [isAnimated, setIsAnimated] = useState(true)
  const [time, setTime] = useState(0)

  // Load saved preferences
  useEffect(() => {
    const savedPreset = localStorage.getItem('gradient-preset') as GradientPreset | null
    const savedAnimation = localStorage.getItem('gradient-animation')
    
    if (savedPreset && gradientPresets[savedPreset]) {
      setCurrentPreset(savedPreset)
    }
    if (savedAnimation !== null) {
      setIsAnimated(savedAnimation === 'true')
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isAnimated) return

    const interval = setInterval(() => {
      setTime(prev => prev + 0.016) // ~60fps
    }, 16)

    return () => clearInterval(interval)
  }, [isAnimated])

  const setPreset = useCallback((preset: GradientPreset) => {
    setCurrentPreset(preset)
    localStorage.setItem('gradient-preset', preset)
  }, [])

  const toggleAnimation = useCallback(() => {
    setIsAnimated(prev => {
      const newValue = !prev
      localStorage.setItem('gradient-animation', newValue.toString())
      return newValue
    })
  }, [])

  const gradientConfig = gradientPresets[currentPreset]

  // Dynamic color interpolation
  const getInterpolatedColor = useCallback((colors: string[], offset: number = 0) => {
    if (!isAnimated) return colors[0]
    
    const speed = gradientConfig.speed
    const t = (time * speed + offset) % (colors.length * 2)
    const index = Math.floor(t) % colors.length
    const nextIndex = (index + 1) % colors.length
    const progress = t - Math.floor(t)
    
    // Simple color interpolation (could be enhanced with proper color mixing)
    return progress < 0.5 ? colors[index] : colors[nextIndex]
  }, [time, isAnimated, gradientConfig.speed])

  const primaryColor = getInterpolatedColor(gradientConfig.primary, 0)
  const secondaryColor = getInterpolatedColor(gradientConfig.secondary, 1)
  const accentColor = getInterpolatedColor(gradientConfig.accent, 2)
  const backgroundColor = getInterpolatedColor(gradientConfig.background, 3)

  // Update CSS custom properties for global use
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--gradient-primary', primaryColor)
    root.style.setProperty('--gradient-secondary', secondaryColor)
    root.style.setProperty('--gradient-accent', accentColor)
    root.style.setProperty('--gradient-background', backgroundColor)
    root.style.setProperty('--gradient-intensity', gradientConfig.intensity.toString())
  }, [primaryColor, secondaryColor, accentColor, backgroundColor, gradientConfig.intensity])

  const value: GradientContextType = {
    currentPreset,
    setPreset,
    gradientConfig,
    isAnimated,
    toggleAnimation,
    time,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor
  }

  return (
    <GradientContext.Provider value={value}>
      {children}
    </GradientContext.Provider>
  )
} 