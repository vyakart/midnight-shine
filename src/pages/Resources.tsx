import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Resource {
  id: string
  title: string
  description: string
  url: string
  category: string
  tags: string[]
  featured?: boolean
}

interface Category {
  name: string
  icon: string
  description: string
  count: number
}

export const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: Category[] = [
    { name: 'Design Tools', icon: '🎨', description: 'Tools for design and creativity', count: 12 },
    { name: 'Development', icon: '💻', description: 'Development tools and frameworks', count: 18 },
    { name: 'Learning', icon: '📚', description: 'Educational resources and courses', count: 15 },
    { name: 'Productivity', icon: '⚡', description: 'Tools to boost productivity', count: 8 },
    { name: 'AI & ML', icon: '🤖', description: 'Artificial Intelligence resources', count: 10 },
    { name: 'Design Systems', icon: '🎯', description: 'Design system resources and guides', count: 6 }
  ]

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Figma',
      description: 'Collaborative interface design tool with powerful prototyping features.',
      url: 'https://figma.com',
      category: 'Design Tools',
      tags: ['Design', 'Prototyping', 'Collaboration'],
      featured: true
    },
    {
      id: '2',
      title: 'React',
      description: 'A JavaScript library for building user interfaces with component-based architecture.',
      url: 'https://reactjs.org',
      category: 'Development',
      tags: ['JavaScript', 'Framework', 'Frontend'],
      featured: true
    },
    {
      id: '3',
      title: 'TypeScript',
      description: 'Typed superset of JavaScript that compiles to plain JavaScript.',
      url: 'https://typescriptlang.org',
      category: 'Development',
      tags: ['JavaScript', 'Types', 'Development']
    },
    {
      id: '4',
      title: 'Framer Motion',
      description: 'Production-ready motion library for React with powerful animation capabilities.',
      url: 'https://framer.com/motion',
      category: 'Development',
      tags: ['Animation', 'React', 'UI']
    },
    {
      id: '5',
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework for rapidly building custom user interfaces.',
      url: 'https://tailwindcss.com',
      category: 'Development',
      tags: ['CSS', 'Framework', 'Styling']
    },
    {
      id: '6',
      title: 'Notion',
      description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
      url: 'https://notion.so',
      category: 'Productivity',
      tags: ['Notes', 'Organization', 'Collaboration']
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Resources
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            Curated collection of tools, libraries, and resources that I use and recommend for design and development.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              🔍
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 dark:bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              All ({resources.length})
            </motion.button>
            {categories.map(category => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 dark:bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource, index) => (
                <motion.a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  {resource.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-100 dark:bg-purple-900/30 text-blue-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {resource.category}
                    </span>
                    <span className="text-blue-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredResources.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No resources found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or category filter.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Suggest Resource */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Know a great resource?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              I'm always looking for new tools and resources to share. Let me know if you have any suggestions!
            </p>
            <button className="px-6 py-3 bg-blue-600 dark:bg-purple-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-purple-700 transition-colors">
              Suggest a Resource
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}