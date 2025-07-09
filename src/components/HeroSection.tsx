import React from 'react'
import { motion } from 'framer-motion'
import { HomeNameAnimation } from './HomeNameAnimation'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero-background.jpg)',
          aspectRatio: '16/9'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      
      {/* Gradient overlay for additional depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      
      {/* Content */}
      <div className="relative z-10 container-width">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <HomeNameAnimation />
          </motion.div>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-xl md:text-2xl text-white/90 dark:text-white/80 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            A creative space showcasing my journey through design, development, 
            and the intersection of art and technology.
          </motion.p>
          
          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <a 
              href="/about" 
              className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Learn About Me
            </a>
            <a 
              href="/art" 
              className="btn bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View My Art
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
} 