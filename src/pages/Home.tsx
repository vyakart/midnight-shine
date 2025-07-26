import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '../contexts/TransitionContext'
import Terminal from '../components/Terminal/Terminal'

export const Home: React.FC = () => {
  const { isTransitioning } = useTransition()

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center p-4">
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl"
          >
            <Terminal className="h-[80vh] shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}