import React from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'
import { MultilingualName } from '../MultilingualName'

interface AboutMeCardProps {
  onClick?: () => void
}

export const AboutMeCard: React.FC<AboutMeCardProps> = ({ onClick }) => {
  return (
    <BentoCard size="large" onClick={onClick} className="group">
      <div className="flex flex-col items-center text-center h-full">
        {/* Profile Image */}
        <motion.div
          className="relative mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">ZS</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
        </motion.div>

        {/* Multilingual Name */}
        <div className="mb-4">
          <MultilingualName />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-600 dark:text-slate-400 mb-6 text-sm"
        >
          Building digital experiences with passion
        </motion.p>

        {/* Social Links */}
        <div className="flex space-x-4 mt-auto">
          {['github', 'twitter', 'linkedin'].map((social, index) => (
            <motion.div
              key={social}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-xs">{social[0].toUpperCase()}</span>
            </motion.div>
          ))}
        </div>

        {/* Click indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Click to explore →
        </motion.div>
      </div>
    </BentoCard>
  )
} 