import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const HomeNameAnimation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedMainText, setTypedMainText] = useState('')
  const [typedLanguageText, setTypedLanguageText] = useState('')
  const [isMainComplete, setIsMainComplete] = useState(false)
  const [showMainCursor, setShowMainCursor] = useState(true)
  const [showLanguageCursor, setShowLanguageCursor] = useState(false)

  const mainName = 'Vyakart'

  // Different scripts for Vyakart (creator in Sanskrit)
  const nameVariations = [
    { text: 'Vyakart', script: 'English' },
    { text: 'ವ್ಯಾಕರ್ತ', script: 'Kannada' },
    { text: '𑄞𑄨𑄠𑄇𑄢𑄴𑄗', script: 'Chakma' },
    { text: 'ヴィヤカルト', script: 'Japanese' },
    { text: 'व्याकर्त', script: 'Sanskrit' },
    { text: 'வ்யாகர்த', script: 'Tamil' },
    { text: 'వ్యాకర్త', script: 'Telugu' },
    { text: 'व्याकर्त', script: 'Hindi' }
  ]

  // Typing animation for main "Vyakart"
  useEffect(() => {
    if (typedMainText.length < mainName.length) {
      const timeout = setTimeout(() => {
        setTypedMainText(mainName.slice(0, typedMainText.length + 1))
      }, 200) // Slightly slower for main text
      return () => clearTimeout(timeout)
    } else {
      setIsMainComplete(true)
      setShowLanguageCursor(true)
    }
  }, [typedMainText, mainName])

  // Typing animation for language variations
  useEffect(() => {
    if (!isMainComplete) return

    const currentText = nameVariations[currentIndex].text
    
    if (typedLanguageText.length < currentText.length) {
      const timeout = setTimeout(() => {
        setTypedLanguageText(currentText.slice(0, typedLanguageText.length + 1))
      }, 120) // Faster typing for language text
      return () => clearTimeout(timeout)
    } else {
      // After finishing typing, wait 2 seconds then move to next language
      const nextTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % nameVariations.length)
        setTypedLanguageText('') // Reset for next language
      }, 2000)
      return () => clearTimeout(nextTimeout)
    }
  }, [typedLanguageText, currentIndex, nameVariations, isMainComplete])

  // Main cursor blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowMainCursor(prev => !prev)
    }, 600)
    return () => clearInterval(blinkInterval)
  }, [])

  // Language cursor blinking (only when language typing is active)
  useEffect(() => {
    if (!showLanguageCursor) return
    
    const blinkInterval = setInterval(() => {
      setShowLanguageCursor(prev => !prev)
    }, 600)
    return () => clearInterval(blinkInterval)
  }, [showLanguageCursor, isMainComplete])

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Main Vyakart with typing effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-clash font-bold text-white"
          style={{ textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}
        >
          {typedMainText}
          <motion.span
            animate={{ opacity: showMainCursor ? 1 : 0 }}
            transition={{ duration: 0.1 }}
            className="text-white"
          >
            _
          </motion.span>
        </h1>
      </motion.div>

      {/* Language variations with typing effect */}
      {isMainComplete && (
        <div className="text-center min-h-[140px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Language text with typing effect and cursor */}
                             <div 
                 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white min-h-[60px] flex items-center justify-center"
                 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
               >
                 <span style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.2' }}>
                   {typedLanguageText}
                 </span>
                 {typedLanguageText.length < nameVariations[currentIndex].text.length && (
                   <motion.span
                     animate={{ opacity: showLanguageCursor ? 1 : 0 }}
                     transition={{ duration: 0.1 }}
                     className="text-white ml-1"
                   >
                     _
                   </motion.span>
                 )}
               </div>
               
               {/* Script label */}
               <div 
                 className="text-sm md:text-base text-white/80 font-medium"
                 style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
               >
                 {nameVariations[currentIndex].script}
               </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {nameVariations.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                  index === currentIndex 
                    ? 'bg-accent-light dark:bg-accent-dark' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  setCurrentIndex(index)
                  setTypedLanguageText('') // Reset typing for manually selected language
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 