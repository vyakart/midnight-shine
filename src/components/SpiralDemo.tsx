'use client'

import { SpiralAnimation } from './SpiralAnimation'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SpiralDemo = () => {
  const [showEnterHint, setShowEnterHint] = useState(false)
  const [canInteract, setCanInteract] = useState(false)
  const navigate = useNavigate()
  
  // Handle navigation to your own site (portfolio)
  const navigateToPortfolio = () => {
    if (canInteract) {
      navigate('/about') // Navigate to your portfolio's About page
    }
  }
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        navigateToPortfolio()
      }
    }
    
    // Add event listener
    window.addEventListener('keydown', handleKeyPress)
    
    // Minimum 5 seconds before allowing interaction
    const interactionTimer = setTimeout(() => {
      setCanInteract(true)
    }, 5000)
    
    // Show enter hint after animation has been running for a bit (but only after 5 seconds)
    const hintTimer = setTimeout(() => {
      setShowEnterHint(true)
    }, 5500)
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      clearTimeout(interactionTimer)
      clearTimeout(hintTimer)
    }
  }, [])
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Spiral Animation - runs continuously with particle disintegration */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
      
      {/* Enter Hint Text - appears after 5.5 seconds */}
      <div
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
          transition-all duration-2000 ease-out
          ${showEnterHint && canInteract ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <div className="text-center">
          <div className="text-green-400 text-2xl tracking-[0.2em] uppercase font-extralight animate-pulse mb-2">
            Enter
          </div>
          <div className="text-green-400/40 text-sm tracking-wider uppercase font-light">
            Press Enter Key to Continue
          </div>
        </div>
      </div>
      
      {/* Invisible clickable area for mouse users - only active after 5 seconds */}
      <button
        onClick={navigateToPortfolio}
        disabled={!canInteract}
        className={`
          absolute inset-0 w-full h-full bg-transparent focus:outline-none
          ${canInteract ? 'cursor-pointer' : 'cursor-wait'}
        `}
        aria-label="Press Enter or click to continue to portfolio"
      />
    </div>
  )
}

export { SpiralDemo }