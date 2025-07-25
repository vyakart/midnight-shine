import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'user' | 'vyakart'
  timestamp: Date
  typing?: boolean
}

interface QuickResponse {
  id: string
  text: string
  response: string
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickResponses, setShowQuickResponses] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickResponses: QuickResponse[] = [
    {
      id: '1',
      text: '👋 Tell me about yourself',
      response: 'Hi! I\'m Vyakart (Nishit), a curious generalist based in Bangalore. I bridge ideas and impact through design, technology, and operations. I love working at the intersection of creativity and code!'
    },
    {
      id: '2', 
      text: '🚀 What projects are you working on?',
      response: 'Currently, I\'m working as an evaluator at VoiceDeck, quantifying journalism impact with LLMs. I also recently led production for EAGxIndia \'24, managing a $100k conference. Always tinkering with new ideas!'
    },
    {
      id: '3',
      text: '📸 I saw your photos - tell me about astrophotography!',
      response: 'Astrophotography is one of my passions! There\'s something magical about capturing the cosmos. I use a Sony A7 III with a Celestron NexStar 8SE telescope. The night sky reminds me how vast and wonderful our universe is.'
    },
    {
      id: '4',
      text: '💼 Are you available for projects?',
      response: 'I\'m always interested in ambitious projects that need a bridge between ideas and execution. If you have something that combines creativity, technology, and impact, let\'s talk! Reach me at vyakart@tuta.io'
    },
    {
      id: '5',
      text: '🌍 What languages do you speak?',
      response: 'I speak English, Tulu, Hindi, Kannada, and I\'m learning Japanese (currently N5 level). Languages fascinate me - they\'re bridges between cultures and ways of thinking!'
    },
    {
      id: '6',
      text: '⚡ What makes you unique?',
      response: 'I\'m what you might call an "Oliemannetje" - Dutch for "little oil man." I grease the wheels between ideas and impact. My superpower is making complex projects feel frictionless through curiosity, craft, and community.'
    }
  ]

  const simulateTyping = (response: string) => {
    setIsTyping(true)
    setShowQuickResponses(false)
    
    // Simulate typing delay based on message length
    const typingDelay = Math.max(1000, response.length * 30)
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'vyakart',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      setIsTyping(false)
      
      // Show quick responses again after a delay
      setTimeout(() => {
        setShowQuickResponses(true)
      }, 1000)
    }, typingDelay)
  }

  const sendMessage = (text: string, isQuickResponse = false) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setCurrentInput('')

    if (isQuickResponse) {
      const quickResponse = quickResponses.find(qr => qr.text === text)
      if (quickResponse) {
        simulateTyping(quickResponse.response)
      }
    } else {
      // Handle custom messages
      let response = "Thanks for your message! I appreciate you reaching out. For the best response, try one of the quick options above, or email me directly at vyakart@tuta.io"
      
      // Simple keyword-based responses
      const lowerText = text.toLowerCase()
      if (lowerText.includes('hello') || lowerText.includes('hi')) {
        response = "Hello! Great to meet you. I'm Vyakart - excited to chat! What would you like to know about me or my work?"
      } else if (lowerText.includes('project') || lowerText.includes('work')) {
        response = "I love working on projects that blend creativity and technology! Currently focused on journalism impact analysis and event production. What kind of project are you thinking about?"
      } else if (lowerText.includes('photo') || lowerText.includes('astro')) {
        response = "Astrophotography is one of my favorite hobbies! The night sky is endlessly fascinating. Do you have any interest in astronomy or photography?"
      }
      
      simulateTyping(response)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return
    sendMessage(currentInput)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'Hi there! I\'m Vyakart. Thanks for dropping by! 👋\n\nFeel free to ask me anything using the quick responses below, or type your own message. I\'d love to chat about projects, photography, or anything else on your mind!',
      sender: 'vyakart',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Chat
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Let's have a conversation! Ask me about my work, interests, or anything else you're curious about.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Vyakart</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white text-sm opacity-90">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          <AnimatePresence>
            {showQuickResponses && !isTyping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-200 dark:border-slate-700 p-4"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Quick responses:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((qr) => (
                    <motion.button
                      key={qr.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(qr.text, true)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm transition-colors"
                    >
                      {qr.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!currentInput.trim() || isTyping}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
              >
                Send
              </motion.button>
            </form>
          </div>
        </div>

        {/* Chat Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Quick Responses</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Use the suggested responses for common questions about my work and interests.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-2xl mb-3">💬</div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Real Conversation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Type your own questions and I'll respond based on what I know about myself and my work.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-2xl mb-3">📧</div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Direct Contact</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              For detailed discussions, reach me at <a href="mailto:vyakart@tuta.io" className="text-blue-500 hover:underline">vyakart@tuta.io</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}