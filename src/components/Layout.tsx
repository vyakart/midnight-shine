import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useTransition } from '../contexts/TransitionContext'
import { Header } from './Header'
import { Footer } from './Footer'
import { NavigationDock } from './NavigationDock'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { isTransitioning, sourceCard, clearTransition } = useTransition()
  const isHomePage = location.pathname === '/'

  React.useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        clearTransition()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, clearTransition])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation Dock only shows on internal pages, not on home page */}
      {!isHomePage && <NavigationDock />}
      
      {/* Header only shows on internal pages, not on home page */}
      {!isHomePage && <Header />}
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{
            opacity: 0,
            scale: isTransitioning ? 0.8 : 1,
            y: isTransitioning ? 0 : 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 1.1,
            y: -20
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            scale: { duration: isTransitioning ? 0.8 : 0.4 }
          }}
          className={`min-h-screen ${!isHomePage ? 'pt-16' : ''}`}
          onAnimationComplete={() => {
            if (isTransitioning) {
              clearTransition()
            }
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Footer only shows on internal pages */}
      {!isHomePage && <Footer />}
    </div>
  )
}