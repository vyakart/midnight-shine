import React from 'react'
import { motion } from 'framer-motion'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`
        grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 
        gap-4 md:gap-6 
        p-4 md:p-6 lg:p-8 
        max-w-7xl mx-auto
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

export const BentoCard: React.FC<{
  size: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  title?: string
}> = ({ size, children, onClick, className = "", title }) => {
  const sizeClasses = {
    small: 'col-span-1 md:col-span-2 lg:col-span-2 aspect-square',
    medium: 'col-span-1 md:col-span-4 lg:col-span-4 aspect-[2/1]',
    large: 'col-span-1 md:col-span-4 lg:col-span-4 aspect-square md:aspect-[2/1] lg:aspect-square'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        bg-white dark:bg-slate-800 
        rounded-2xl 
        border border-slate-200 dark:border-slate-700
        p-6 
        cursor-pointer
        transition-all duration-300
        hover:border-blue-300 dark:hover:border-purple-500
        relative
        overflow-hidden
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  )
} 