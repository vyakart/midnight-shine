import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

export const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section with WebGL Background */}
      <Hero />

      {/* Featured Sections */}
      <div className="section-padding bg-white dark:bg-slate-900">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Writing',
                description: 'Thoughts, insights, and stories from my journey',
                href: '/writing',
                icon: '✍️',
              },
              {
                title: 'Resources',
                description: 'Curated collection of tools and links',
                href: '/resources',
                icon: '📚',
              },
              {
                title: 'Support',
                description: 'Ways to support my work and initiatives',
                href: '/support',
                icon: '💝',
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              >
                <Link to={section.href} className="block card card-hover p-6 h-full">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{section.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 