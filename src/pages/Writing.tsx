import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  featured?: boolean
}

export const Writing: React.FC = () => {
  const navigate = useNavigate()

  // Mock blog posts data - will be replaced with real data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Building Modern Web Applications',
      excerpt: 'A deep dive into modern web development practices, frameworks, and tools that are shaping the future of web applications.',
      date: 'Dec 15, 2024',
      readTime: '5 min read',
      tags: ['React', 'TypeScript', 'Web Development'],
      featured: true
    },
    {
      id: '2',
      title: 'The Future of AI Development',
      excerpt: 'Exploring how artificial intelligence is transforming software development and what developers need to know to stay ahead.',
      date: 'Dec 10, 2024',
      readTime: '3 min read',
      tags: ['AI', 'Machine Learning', 'Future Tech']
    },
    {
      id: '3',
      title: 'Design Systems at Scale',
      excerpt: 'Creating and maintaining design systems that work across large organizations and multiple product teams.',
      date: 'Dec 5, 2024',
      readTime: '7 min read',
      tags: ['Design Systems', 'UI/UX', 'Scalability']
    },
    {
      id: '4',
      title: 'Performance Optimization Techniques',
      excerpt: 'Practical strategies for optimizing web application performance and delivering exceptional user experiences.',
      date: 'Nov 28, 2024',
      readTime: '6 min read',
      tags: ['Performance', 'Optimization', 'Web Vitals']
    },
    {
      id: '5',
      title: 'The Art of Code Reviews',
      excerpt: 'Best practices for conducting meaningful code reviews that improve code quality and team collaboration.',
      date: 'Nov 20, 2024',
      readTime: '4 min read',
      tags: ['Code Review', 'Team Collaboration', 'Best Practices']
    }
  ]

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
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Writing
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            Thoughts on technology, development, design, and the intersection of creativity and code.
          </p>
        </motion.div>

        {/* Featured Post */}
        {blogPosts.find(post => post.featured) && (
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-sm font-semibold text-blue-600 dark:text-purple-400 mb-4 uppercase tracking-wide">
              Featured Post
            </h2>
            {blogPosts
              .filter(post => post.featured)
              .map(post => (
                <motion.article
                  key={post.id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 dark:bg-purple-900/30 text-blue-700 dark:text-purple-300 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-blue-600 dark:text-purple-400 font-medium">
                      Read more →
                    </span>
                  </div>
                </motion.article>
              ))}
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            All Posts
          </h2>
          <div className="space-y-6">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover={{ x: 8 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 lg:mb-0">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between lg:flex-col lg:items-end lg:ml-6 text-sm text-slate-500 dark:text-slate-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Stay Updated
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Get notified when I publish new articles about technology, design, and development.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
              />
              <button className="px-6 py-3 bg-blue-600 dark:bg-purple-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}