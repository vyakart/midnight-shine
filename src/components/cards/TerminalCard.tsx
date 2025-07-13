import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface TerminalCardProps {
  onClick?: () => void
}

export const TerminalCard: React.FC<TerminalCardProps> = ({ onClick }) => {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState('')
  
  const terminalLines = [
    '$ whoami',
    'ziksartin',
    '$ pwd',
    '/Users/ziksartin/portfolio',
    '$ ls -la',
    'total 42',
    'drwxr-xr-x about.md',
    'drwxr-xr-x projects/',
    'drwxr-xr-x blog/',
    '$ cat welcome.txt',
    'Hello! Welcome to my terminal.',
    'Type "help" for available commands.',
    '$ █'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        const line = terminalLines[currentLine]
        let charIndex = 0
        
        const typeInterval = setInterval(() => {
          if (charIndex < line.length) {
            setDisplayText(prev => prev + line[charIndex])
            charIndex++
          } else {
            clearInterval(typeInterval)
            setDisplayText(prev => prev + '\n')
            setCurrentLine(prev => prev + 1)
          }
        }, 50)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentLine])

  return (
    <BentoCard size="small" onClick={onClick} title="Terminal" className="group">
      <div className="flex flex-col h-full">
        {/* Terminal window */}
        <div className="flex-1 bg-black rounded-lg p-3 font-mono text-xs overflow-hidden">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-xs ml-2">terminal</span>
          </div>
          
          <div className="text-green-400 leading-relaxed">
            <pre className="whitespace-pre-wrap">{displayText}</pre>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-green-400"
            >
              █
            </motion.span>
          </div>
        </div>

        {/* Terminal status */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>~/portfolio</span>
          <span className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>online</span>
          </span>
        </div>

        {/* Interactive indicator */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Interactive →
        </div>
      </div>
    </BentoCard>
  )
} 