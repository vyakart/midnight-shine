import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MultilingualNameProps {
  layout?: 'centered' | 'left-aligned'
  showSubtitle?: boolean
}

export const MultilingualName: React.FC<MultilingualNameProps> = ({ 
  layout = 'left-aligned', 
  showSubtitle = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const fullName = 'Nishit'

  // Different scripts for Vyakart (creator in Sanskrit)
  const nameVariations = [
    { text: 'Vyakart', script: 'English', meaning: 'creator' },
    { text: 'ವ್ಯಾಕರ್ತ', script: 'Kannada', meaning: 'creator' },
    { text: '𑄞𑄨𑄠𑄇𑄢𑄴𑄗', script: 'Chakma', meaning: 'creator' },
    { text: 'ヴィヤカルト', script: 'Japanese', meaning: 'creator' },
    { text: 'व्याकर्त', script: 'Sanskrit', meaning: 'creator' },
    { text: 'வ்யாகர்த', script: 'Tamil', meaning: 'creator' },
    { text: 'వ్యాకర్త', script: 'Telugu', meaning: 'creator' },
    { text: 'व्याकर्त', script: 'Hindi', meaning: 'creator' }
  ]

  // Typing animation for Nishit
  useEffect(() => {
    if (typedText.length < fullName.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullName.slice(0, typedText.length + 1))
      }, 150) // Typing speed
      return () => clearTimeout(timeout)
    } else {
      setIsTypingComplete(true)
    }
  }, [typedText, fullName])

  // Cycle through different scripts every 3 seconds after typing is complete
  useEffect(() => {
    if (!isTypingComplete) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % nameVariations.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [nameVariations.length, isTypingComplete])

  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 600)

    return () => clearInterval(blinkInterval)
  }, [])

  const isCentered = layout === 'centered'
  
  return (
    <div className={isCentered ? "flex flex-col items-center space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"}>
      {/* Names section */}
      <div className={`space-y-8 ${isCentered ? 'text-center' : ''}`}>
        {/* Nishit with typing effect */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-clash font-bold text-gray-900 dark:text-gray-100">
            {typedText}
            <motion.span
              animate={{ opacity: showCursor ? 1 : 0 }}
              transition={{ duration: 0.1 }}
              className="text-blue-600 dark:text-purple-400"
            >
              _
            </motion.span>
          </h1>
        </motion.div>

        {/* Multilingual Vyakart - only show after typing is complete */}
        {isTypingComplete && (
          <div className="min-h-[120px] flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.8 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-medium text-gradient">
                  {nameVariations[currentIndex].text}
                </div>
                <div className="text-sm md:text-base text-secondary-light dark:text-secondary-dark">
                  <span className="font-medium">{nameVariations[currentIndex].script}</span>
                  {nameVariations[currentIndex].script !== 'English' && (
                    <span className="mx-2">•</span>
                  )}
                  <span className="italic">{nameVariations[currentIndex].meaning}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator dots */}
            <div className="flex space-x-2 mt-6">
              {nameVariations.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                    index === currentIndex 
                      ? 'bg-accent-light dark:bg-accent-dark' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Subtitle explaining the animation */}
        {isTypingComplete && showSubtitle && (
          <motion.p
            initial={{ opacity: 0, x: isCentered ? 0 : -20, y: isCentered ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base md:text-lg text-secondary-light dark:text-secondary-dark max-w-2xl"
          >
            A bridge between cultures, languages, and ideas — where every script tells the same story of creation.
          </motion.p>
        )}
      </div>

      {/* Right side - Reserved for future animation - only show in left-aligned layout */}
      {!isCentered && (
        <div className="hidden lg:flex items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-center text-secondary-light dark:text-secondary-dark"
          >
            {/* Placeholder for your future animation */}
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">Animation space reserved</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 