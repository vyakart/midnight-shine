import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SpiralAnimation } from './SpiralAnimation'
import { useTheme } from '../contexts/ThemeContext'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { isDark, toggleTheme } = useTheme()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showEnterButton, setShowEnterButton] = useState(false)

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 15
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setShowEnterButton(true), 500)
          return 100
        }
        return next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const handleEnter = () => {
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-900 text-white' 
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={toggleTheme}
        className={`absolute top-8 right-8 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
            : 'bg-white hover:bg-gray-100 text-slate-600 shadow-lg'
        }`}
        aria-label="Toggle theme"
      >
        <motion.div
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {isDark ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Spiral Animation Background */}
      <div className="absolute inset-0">
        <SpiralAnimation isDarkMode={isDark} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Nishit
          </h1>
          <p className={`text-xl lg:text-2xl ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Building the future, one pixel at a time
          </p>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="w-80 max-w-full mb-8"
        >
          {/* Progress Bar */}
          <div className={`w-full h-2 rounded-full mb-4 ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
          
          {/* Progress Text */}
          <div className="flex justify-between items-center text-sm">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Loading experience...
            </span>
            <motion.span
              key={Math.floor(loadingProgress)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={isDark ? 'text-slate-300' : 'text-slate-700'}
            >
              {Math.floor(loadingProgress)}%
            </motion.span>
          </div>
        </motion.div>

        {/* Enter Button */}
        <AnimatePresence>
          {showEnterButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25'
              }`}
            >
              Enter Portfolio
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-2 inline-block"
              >
                →
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Loading Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={`mt-8 text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {loadingProgress < 30 && "Initializing creative space..."}
            {loadingProgress >= 30 && loadingProgress < 60 && "Loading projects..."}
            {loadingProgress >= 60 && loadingProgress < 90 && "Preparing experience..."}
            {loadingProgress >= 90 && !showEnterButton && "Almost ready..."}
            {showEnterButton && "Ready to explore!"}
          </motion.p>
        </motion.div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0 
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 0],
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-white' : 'bg-slate-400'
            }`}
            style={{
              boxShadow: isDark 
                ? '0 0 6px rgba(255, 255, 255, 0.6)' 
                : '0 0 4px rgba(100, 116, 139, 0.4)'
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}