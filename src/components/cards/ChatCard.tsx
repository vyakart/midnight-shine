import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface ChatCardProps {
  onClick?: () => void
}

export const ChatCard: React.FC<ChatCardProps> = ({ onClick }) => {
  const [isTyping, setIsTyping] = useState(false)
  
  // Mock chat messages
  const messages = [
    { id: 1, type: 'received', text: 'Hi there! How can I help you?', time: '2:30 PM' },
    { id: 2, type: 'sent', text: 'Hello! I\'d like to know more about your work.', time: '2:32 PM' }
  ]

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(prev => !prev)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <BentoCard size="small" onClick={onClick} title="Chat" className="group">
      <div className="flex flex-col h-full">
        {/* Chat messages */}
        <div className="flex-1 space-y-2 mb-3">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg text-xs ${
                  message.type === 'sent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 h-1 bg-slate-400 dark:bg-slate-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Chat input preview */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
              Type a message...
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="text-white text-xs">→</span>
            </motion.div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            Open chat →
          </div>
        </div>
      </div>
    </BentoCard>
  )
} 