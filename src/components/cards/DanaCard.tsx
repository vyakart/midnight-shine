import React from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface DanaCardProps {
  onClick?: () => void
}

export const DanaCard: React.FC<DanaCardProps> = ({ onClick }) => {
  // Mock data - will be replaced with real donation data
  const supporterCount = 24
  const impactScore = 78
  const monthlyGoal = 1000
  const currentAmount = 680

  const progressPercentage = (currentAmount / monthlyGoal) * 100

  return (
    <BentoCard size="medium" onClick={onClick} title="Dāna" className="group">
      <div className="flex flex-col h-full">
        {/* Impact meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Monthly goal
            </span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              ${currentAmount}/${monthlyGoal}
            </span>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            />
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {Math.round(progressPercentage)}% of monthly goal
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {supporterCount}
            </motion.div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Supporters
            </div>
          </div>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200"
            >
              {impactScore}
            </motion.div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Impact Score
            </div>
          </div>
        </div>

        {/* Recent supporter */}
        <div className="mt-auto">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Recent supporter
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">A</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Anonymous • $25
            </div>
          </div>
        </div>

        {/* Support indicator */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Support →
        </div>
      </div>
    </BentoCard>
  )
} 