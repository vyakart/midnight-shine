import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full p-1 
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDark 
          ? 'bg-gray-700 focus:ring-purple-500' 
          : 'bg-gray-200 focus:ring-blue-500'
        }
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <motion.div
        className={`
          w-5 h-5 rounded-full shadow-lg transform transition-transform duration-300
          flex items-center justify-center text-xs
          ${isDark 
            ? 'bg-purple-500 text-white' 
            : 'bg-blue-500 text-white'
          }
        `}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.span
          animate={{
            rotate: isDark ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {isDark ? '🌙' : '☀️'}
        </motion.span>
      </motion.div>
    </button>
  )
} 