import React from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header only shows on internal pages, not on home page */}
      {!isHomePage && <Header />}
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen ${!isHomePage ? 'pt-16' : ''}`}
      >
        {children}
      </motion.main>
      
      {/* Footer only shows on internal pages */}
      {!isHomePage && <Footer />}
    </div>
  )
} 