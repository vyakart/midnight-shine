import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface TransitionContextType {
  isTransitioning: boolean
  sourceCard: string | null
  setTransition: (cardId: string) => void
  clearTransition: () => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

interface TransitionProviderProps {
  children: ReactNode
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [sourceCard, setSourceCard] = useState<string | null>(null)

  const setTransition = (cardId: string) => {
    setSourceCard(cardId)
    setIsTransitioning(true)
    
    // Clear transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 800)
  }

  const clearTransition = () => {
    setIsTransitioning(false)
    setSourceCard(null)
  }

  return (
    <TransitionContext.Provider value={{
      isTransitioning,
      sourceCard,
      setTransition,
      clearTransition
    }}>
      {children}
    </TransitionContext.Provider>
  )
}

export const useTransition = () => {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}