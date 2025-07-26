import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MultilingualName } from '../components/MultilingualName'
import { personalInfo, experiences, skillCategories } from '../data/portfolioContent'

export const About: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('about')
  const [typingText, setTypingText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  // Terminal-style typing effect
  useEffect(() => {
    const text = "cat ~/about.txt"
    let i = 0
    const timer = setInterval(() => {
      setTypingText(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  // Blinking cursor effect
  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(timer)
  }, [])

  const principles = [
    {
      title: "Curiosity compounds.",
      description: "I chase breadth early, depth where it matters."
    },
    {
      title: "Community is infrastructure.",
      description: "Strong networks outlast any single project."
    },
    {
      title: "Craft over credentials.",
      description: "Show, don't tell; iterate in public."
    }
  ]

  const TerminalHeader = () => (
    <div className="bg-slate-800 px-4 py-3 flex items-center space-x-2 rounded-t-lg">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      <div className="flex-1 text-center">
        <span className="text-slate-400 text-sm font-mono">terminal — vyakart@portfolio</span>
      </div>
    </div>
  )

  const TerminalPrompt = ({ command, output }: { command?: string, output: React.ReactNode }) => (
    <div className="mb-4">
      {command && (
        <div className="text-green-400 font-mono text-sm mb-2">
          <span className="text-blue-400">vyakart@portfolio:~$</span> {command}
        </div>
      )}
      <div className="text-gray-300 font-mono text-sm leading-relaxed">
        {output}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            About
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Get to know me through terminal commands and structured data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Terminal Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl">
              <TerminalHeader />
              
              <div className="p-6 h-96 overflow-y-auto font-mono text-sm">
                <TerminalPrompt
                  command={`${typingText}${showCursor ? '█' : ' '}`}
                  output={
                    <div className="space-y-4">
                      <div>
                        <div className="text-cyan-400 font-bold">{personalInfo.name}</div>
                        <div className="text-yellow-400">{personalInfo.title}</div>
                        <div className="text-gray-400">📍 {personalInfo.location}</div>
                        <div className="text-gray-400">📧 {personalInfo.email}</div>
                      </div>
                      
                      <div className="border-l-2 border-blue-500 pl-4">
                        <div className="text-purple-400 mb-2">{personalInfo.tagline}</div>
                        <div className="text-gray-300 leading-relaxed">
                          {personalInfo.bio.split('\n').map((line, i) => (
                            <div key={i} className="mb-2">{line}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-green-400 mb-1">Languages:</div>
                        <div className="text-gray-300">
                          {personalInfo.languages.map((lang, i) => (
                            <span key={i} className="mr-4">• {lang}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  }
                />
                
                <TerminalPrompt
                  command="ls -la ~/skills/"
                  output={
                    <div className="space-y-2">
                      {skillCategories.map((category) => (
                        <div key={category.category} className="flex items-center space-x-2">
                          <span className="text-blue-400">📁</span>
                          <span className="text-gray-300">{category.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}/</span>
                          <span className="text-gray-500 text-xs">({category.skills.length} items)</span>
                        </div>
                      ))}
                    </div>
                  }
                />

                <TerminalPrompt
                  command="tail -n 3 ~/experience/recent.log"
                  output={
                    <div className="space-y-1">
                      {experiences.slice(0, 3).map((exp, i) => (
                        <div key={i} className="text-gray-300">
                          <span className="text-yellow-400">[{exp.period || '2024'}]</span>{' '}
                          <span className="text-cyan-400">{exp.role}</span> @{' '}
                          <span className="text-green-400">{exp.organization}</span>
                        </div>
                      ))}
                    </div>
                  }
                />
              </div>
            </motion.div>

            {/* Terminal Navigation Hints */}
            <motion.div variants={itemVariants} className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                💡 Try these commands in the main terminal:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">whoami</code>
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">skills</code>
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">experience</code>
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">projects</code>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-1 lg:order-2"
          >
            {/* Hero Section with Multilingual Name Animation */}
            <motion.section variants={itemVariants} className="mb-12">
              <MultilingualName layout="left-aligned" showSubtitle={true} />
              
              {/* Subtitle with Oliemannetje reference */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="mt-8"
              >
                <h2 className="text-xl md:text-2xl font-normal text-gradient mb-2">
                  Oliemannetje
                  <span className="block text-sm md:text-base text-secondary-light dark:text-secondary-dark font-light">
                    (Dutch for "little oil man")
                  </span>
                </h2>
                <p className="text-base md:text-lg text-secondary-light dark:text-secondary-dark italic">
                  I grease the wheels between ideas and impact — a curious generalist driven by craft, community & clarity.
                </p>
              </motion.div>
            </motion.section>

            {/* What I Do Best */}
            <motion.section variants={itemVariants} className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">What I do best</h3>
              <div className="space-y-4">
                {skillCategories.map((skill, index) => (
                  <motion.div
                    key={skill.category}
                    variants={itemVariants}
                    className="card p-4 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-blue-600 dark:text-purple-400 flex items-center">
                      <span className="mr-2 text-xl">{skill.icon}</span>
                      {skill.category}
                    </h4>
                    <div className="text-sm text-secondary-light dark:text-secondary-dark">
                      {skill.skills.slice(0, 4).join(' • ')}
                      {skill.skills.length > 4 && ` • +${skill.skills.length - 4} more`}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Guiding Principles */}
            <motion.section variants={itemVariants} className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Guiding principles</h3>
              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="card p-4 border-l-4 border-blue-500 dark:border-purple-500"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl font-bold text-blue-600 dark:text-purple-400 w-8">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1 text-blue-600 dark:text-purple-400">
                          {principle.title}
                        </h4>
                        <p className="text-sm text-secondary-light dark:text-secondary-dark">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Beyond Work */}
            <motion.section variants={itemVariants} className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Beyond work</h3>
              <div className="card p-6">
                <p className="text-base leading-relaxed">
                  Astrophotographer, jiu-jitsu volunteer, multi-lingual (English, Tulu, Hindi, Kannada, 日本語 N5)
                  and a relentless note-taker of eclectic resources I'll soon share here.
                </p>
              </div>
            </motion.section>

            {/* Call to Action */}
            <motion.section variants={itemVariants}>
              <div className="card p-6 bg-gradient-light dark:bg-gradient-dark">
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  Got an ambitious idea that needs a <em>bridge</em>?
                </h3>
                <a
                  href="mailto:vyakart@tuta.io"
                  className="btn btn-primary text-base px-6 py-3 inline-block"
                >
                  Let's talk → vyakart@tuta.io
                </a>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </div>
  )
}