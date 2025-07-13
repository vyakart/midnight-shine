import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface ResourcesCardProps {
  onClick?: () => void
}

export const ResourcesCard: React.FC<ResourcesCardProps> = ({ onClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const resourceCategories = [
    { name: 'Design Tools', count: 12, icon: '🎨' },
    { name: 'Development', count: 8, icon: '💻' },
    { name: 'Learning', count: 15, icon: '📚' },
    { name: 'Productivity', count: 6, icon: '⚡' }
  ]

  return (
    <BentoCard 
      size="small" 
      onClick={onClick} 
      title="Resources" 
      className="group relative"
    >
      <div className="flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Curated collection of tools and resources
          </p>
          
          {/* Quick access button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsDropdownOpen(!isDropdownOpen)
            }}
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg p-3 text-sm transition-colors"
          >
            Browse Categories
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10"
              >
                {resourceCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle category click
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {category.count}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total count */}
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          {resourceCategories.reduce((sum, cat) => sum + cat.count, 0)} resources
        </div>
      </div>
    </BentoCard>
  )
} 