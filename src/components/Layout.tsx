import React from 'react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-dynamic">
      <Header />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 min-h-screen"
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  )
} 