import React from 'react'
import { motion } from 'framer-motion'
import { MultilingualName } from '../components/MultilingualName'

export const About: React.FC = () => {
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

  const highlights = [
    {
      role: "Evaluator, VoiceDeck",
      period: "2024 — now",
      description: "quantifying journalism impact reports with LLMs and curating AI-generated artwork."
    },
    {
      role: "Production Lead, EAGxIndia '24",
      period: "",
      description: "steered a USD 100k conference, leading AV, design and safety for 300 attendees."
    },
    {
      role: "0xNARC",
      period: "",
      description: "hackathon scoring tool (GPT × Ethereum) issuing soul-bound NFTs for contributor recognition."
    },
    {
      role: "Photographer, Impact Academy",
      period: "",
      description: "captured a 3-day summit while managing on-site ops."
    }
  ]

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

  const skills = [
    {
      category: "Design & Visual Storytelling",
      items: "graphic + motion design, brand assets, photography"
    },
    {
      category: "Technical Hacking",
      items: "rapid prototyping, blockchain dev-rel, GPT/LLM workflows"
    },
    {
      category: "Ops & Production",
      items: "logistics, risk planning, stakeholder wrangling for events up to 300 people"
    }
  ]

  return (
    <div className="section-padding">
      <div className="container-width">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section with Multilingual Name Animation */}
          <motion.section variants={itemVariants} className="text-center mb-20">
            <MultilingualName layout="left-aligned" showSubtitle={true} />
            
            {/* Subtitle with Oliemannetje reference */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-12"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gradient mb-4">
                Oliemannetje
                <span className="block text-lg md:text-xl text-secondary-light dark:text-secondary-dark font-light">
                  (Dutch for "little oil man")
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-secondary-light dark:text-secondary-dark max-w-3xl mx-auto italic">
                I grease the wheels between ideas and impact — a curious generalist driven by craft, community & clarity.
              </p>
            </motion.div>
          </motion.section>

          {/* Narrative Block */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg md:text-xl leading-relaxed mb-8">
                I'm <strong>Vyakart</strong> (he/him), a Bangalore-based connector who thrives at the messy intersection of technology, design and operations. From running FEA simulations on delta-wing aircraft to orchestrating six-figure conferences, I make complex projects feel friction-less.
              </p>
            </div>
          </motion.section>

          {/* What I Do Best */}
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What I do best</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.category}
                  variants={itemVariants}
                  className="card p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-purple-400">
                    {skill.category}
                  </h3>
                  <p className="text-secondary-light dark:text-secondary-dark leading-relaxed">
                    {skill.items}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Selected Highlights */}
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Selected highlights</h2>
            <div className="space-y-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card p-6 hover:border-accent-light dark:hover:border-accent-dark transition-colors duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-purple-400 mb-1">
                        {highlight.role}
                        {highlight.period && (
                          <span className="text-sm font-normal text-secondary-light dark:text-secondary-dark ml-2">
                            {highlight.period}
                          </span>
                        )}
                      </h3>
                      <p className="text-secondary-light dark:text-secondary-dark leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Guiding Principles */}
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Guiding principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card p-6 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-4xl mb-4">{index + 1}</div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-purple-400">
                    {principle.title}
                  </h3>
                  <p className="text-secondary-light dark:text-secondary-dark">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Beyond Work */}
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Beyond work</h2>
            <div className="card p-8 text-center">
              <p className="text-lg leading-relaxed">
                Astrophotographer, jiu-jitsu volunteer, multi-lingual (English, Tulu, Hindi, Kannada, 日本語 N5) 
                and a relentless note-taker of eclectic resources I'll soon share here.
              </p>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section variants={itemVariants} className="text-center">
            <div className="card p-8 bg-gradient-light dark:bg-gradient-dark">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Got an ambitious idea that needs a <em>bridge</em>?
              </h2>
              <a 
                href="mailto:vyakart@tuta.io"
                className="btn btn-primary text-lg px-8 py-4 inline-block"
              >
                Let's talk → vyakart@tuta.io
              </a>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
} 