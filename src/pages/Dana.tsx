import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface SupportOption {
  id: string
  title: string
  description: string
  amount: number
  icon: string
  popular?: boolean
}

interface Supporter {
  name: string
  amount: number
  message?: string
  date: string
  anonymous?: boolean
}

export const Dana: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  // Mock data - will be replaced with real payment integration
  const supportOptions: SupportOption[] = [
    {
      id: 'coffee',
      title: 'Buy me a coffee',
      description: 'Fuel my late-night coding sessions',
      amount: 5,
      icon: '☕'
    },
    {
      id: 'lunch',
      title: 'Buy me lunch',
      description: 'Support a day of focused work',
      amount: 25,
      icon: '🍜',
      popular: true
    },
    {
      id: 'book',
      title: 'Buy me a book',
      description: 'Invest in continuous learning',
      amount: 50,
      icon: '📚'
    },
    {
      id: 'gear',
      title: 'Support new gear',
      description: 'Help me upgrade tools and equipment',
      amount: 100,
      icon: '⚡'
    }
  ]

  const recentSupporters: Supporter[] = [
    {
      name: 'Anonymous',
      amount: 25,
      message: 'Love your work on the bento grid portfolio!',
      date: '2 hours ago',
      anonymous: true
    },
    {
      name: 'Sarah Chen',
      amount: 50,
      message: 'Your astrophotography is incredible!',
      date: '1 day ago'
    },
    {
      name: 'Anonymous',
      amount: 10,
      date: '3 days ago',
      anonymous: true
    },
    {
      name: 'Raj Patel',
      amount: 25,
      message: 'Thanks for sharing your resources!',
      date: '5 days ago'
    }
  ]

  const totalSupport = 2480
  const supporterCount = 42
  const monthlyGoal = 1000
  const currentMonthly = 680
  const impactScore = 78

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

  const handleSupport = (amount: number) => {
    // Simulate payment process
    setShowThankYou(true)
    setTimeout(() => setShowThankYou(false), 3000)
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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Dāna
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            <em>Dāna</em> (Sanskrit: दान) means "giving" - a practice of generosity that creates positive ripples. 
            Your support helps me continue creating, learning, and sharing openly.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-purple-400 mb-2">
              ${totalSupport.toLocaleString()}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Total Support</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {supporterCount}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Supporters</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {impactScore}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Impact Score</div>
          </div>
        </motion.div>

        {/* Monthly Goal */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-12 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Monthly Goal
            </h3>
            <span className="text-lg font-medium text-slate-600 dark:text-slate-400">
              ${currentMonthly}/${monthlyGoal}
            </span>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentMonthly / monthlyGoal) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            />
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {Math.round((currentMonthly / monthlyGoal) * 100)}% of monthly goal • 
            This helps me dedicate time to open-source projects, writing, and community building.
          </p>
        </motion.div>

        {/* Support Options */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
            Choose Your Support Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {supportOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedAmount(option.amount)}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 border cursor-pointer transition-all duration-300 ${
                  selectedAmount === option.amount
                    ? 'border-blue-500 dark:border-purple-500 ring-2 ring-blue-500/20 dark:ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-purple-400'
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 dark:bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-3xl mb-3">{option.icon}</div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {option.description}
                  </p>
                  <div className="text-2xl font-bold text-blue-600 dark:text-purple-400">
                    ${option.amount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Or choose a custom amount:</p>
            <div className="flex justify-center items-center space-x-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(Number(e.target.value))
                  }}
                  placeholder="0"
                  className="pl-8 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 w-32"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Button */}
        {selectedAmount && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <button
              onClick={() => handleSupport(selectedAmount)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Support with ${selectedAmount} ✨
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Secure payment via Razorpay • No account required
            </p>
          </motion.div>
        )}

        {/* Recent Supporters */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
            Recent Supporters 🙏
          </h2>
          
          <div className="space-y-4">
            {recentSupporters.map((supporter, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {supporter.anonymous ? '?' : supporter.name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {supporter.name}
                      </h3>
                      {supporter.message && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          "{supporter.message}"
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {supporter.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ${supporter.amount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Statement */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            How Your Support Creates Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <div className="text-2xl mb-2">🔧</div>
              <p><strong>Open Source:</strong> More time for contributing to tools that help everyone build better.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📖</div>
              <p><strong>Knowledge Sharing:</strong> Writing tutorials, guides, and insights from real-world experience.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌱</div>
              <p><strong>Community:</strong> Supporting events, mentorship, and building bridges between ideas and impact.</p>
            </div>
          </div>
          <p className="mt-6 text-slate-700 dark:text-slate-300 italic">
            Every contribution, no matter the size, helps me continue this journey of curiosity, craft, and community. Thank you! 🙏
          </p>
        </motion.div>

        {/* Thank You Modal */}
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center max-w-md">
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Thank You!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your support means the world to me. It helps me continue creating, learning, and sharing with the community.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}