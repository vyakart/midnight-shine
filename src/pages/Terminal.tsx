import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Command {
  input: string
  output: string[]
  timestamp: string
}

interface FileSystemItem {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: FileSystemItem[]
}

export const Terminal: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('')
  const [history, setHistory] = useState<Command[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentPath, setCurrentPath] = useState('~')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Mock file system
  const fileSystem: FileSystemItem = {
    name: 'home',
    type: 'directory',
    children: [
      {
        name: 'portfolio',
        type: 'directory',
        children: [
          {
            name: 'about.md',
            type: 'file',
            content: 'Hi! I\'m Vyakart (Nishit), a curious generalist who bridges ideas and impact.'
          },
          {
            name: 'projects',
            type: 'directory',
            children: [
              { name: 'bento-portfolio.md', type: 'file', content: 'Modern portfolio built with React and Tailwind CSS' },
              { name: '0xNARC.md', type: 'file', content: 'Hackathon scoring tool with GPT × Ethereum integration' }
            ]
          },
          {
            name: 'skills.txt',
            type: 'file',
            content: 'Design & Visual Storytelling\nTechnical Hacking\nOps & Production'
          },
          { name: 'contact.txt', type: 'file', content: 'Email: vyakart@tuta.io\nLocation: Bangalore, India' }
        ]
      },
      {
        name: 'photos',
        type: 'directory',
        children: [
          { name: 'astrophotography', type: 'directory' },
          { name: 'events', type: 'directory' },
          { name: 'daily', type: 'directory' }
        ]
      }
    ]
  }

  const commands = {
    help: () => [
      'Available commands:',
      '  help          - Show this help message',
      '  ls            - List directory contents',
      '  pwd           - Print working directory',
      '  cd <dir>      - Change directory',
      '  cat <file>    - Display file contents',
      '  whoami        - Display user information',
      '  clear         - Clear terminal',
      '  date          - Show current date and time',
      '  echo <text>   - Display text',
      '  tree          - Show directory tree',
      '',
      'Navigate around and explore! Try "ls" to start.'
    ],

    ls: () => {
      const currentDir = getCurrentDirectory()
      if (!currentDir || !currentDir.children) return ['Directory not found']
      
      return currentDir.children.map(item => {
        const icon = item.type === 'directory' ? '📁' : '📄'
        return `${icon} ${item.name}`
      })
    },

    pwd: () => [currentPath === '~' ? '/Users/vyakart' : currentPath],

    whoami: () => [
      'vyakart (Nishit)',
      'Location: Bangalore, India',
      'Role: Curious Generalist & Bridge Builder',
      'Languages: English, Tulu, Hindi, Kannada, 日本語 N5',
      'Interests: Astrophotography, Jiu-jitsu, Multi-lingual adventures'
    ],

    clear: () => {
      setHistory([])
      return []
    },

    date: () => [new Date().toString()],

    tree: () => {
      const buildTree = (item: FileSystemItem, prefix = '', isLast = true): string[] => {
        const lines: string[] = []
        const current = `${prefix}${isLast ? '└── ' : '├── '}${item.name}`
        lines.push(current)
        
        if (item.children) {
          item.children.forEach((child, index) => {
            const isLastChild = index === item.children!.length - 1
            const newPrefix = prefix + (isLast ? '    ' : '│   ')
            lines.push(...buildTree(child, newPrefix, isLastChild))
          })
        }
        
        return lines
      }
      
      return buildTree(fileSystem)
    }
  }

  const getCurrentDirectory = (): FileSystemItem | null => {
    if (currentPath === '~') return fileSystem
    // Simplified path resolution for demo
    return fileSystem
  }

  const executeCommand = (input: string) => {
    const [cmd, ...args] = input.trim().split(' ')
    const timestamp = new Date().toLocaleTimeString()

    let output: string[] = []

    switch (cmd.toLowerCase()) {
      case 'help':
        output = commands.help()
        break
      case 'ls':
        output = commands.ls()
        break
      case 'pwd':
        output = commands.pwd()
        break
      case 'whoami':
        output = commands.whoami()
        break
      case 'clear':
        output = commands.clear()
        return // Don't add to history for clear command
      case 'date':
        output = commands.date()
        break
      case 'tree':
        output = commands.tree()
        break
      case 'echo':
        output = [args.join(' ')]
        break
      case 'cat':
        const fileName = args[0]
        if (!fileName) {
          output = ['cat: missing file name']
        } else {
          const currentDir = getCurrentDirectory()
          const file = currentDir?.children?.find(item => item.name === fileName && item.type === 'file')
          if (file && file.content) {
            output = file.content.split('\n')
          } else {
            output = [`cat: ${fileName}: No such file or directory`]
          }
        }
        break
      case 'cd':
        const dir = args[0]
        if (!dir || dir === '~') {
          setCurrentPath('~')
          output = []
        } else {
          output = [`cd: ${dir}: No such file or directory`]
        }
        break
      case '':
        output = []
        break
      default:
        output = [`command not found: ${cmd}. Type 'help' for available commands.`]
    }

    const command: Command = { input, output, timestamp }
    setHistory(prev => [...prev, command])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    setIsTyping(true)
    executeCommand(currentInput)
    setCurrentInput('')
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false)
    }, 100)
  }

  useEffect(() => {
    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new content is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    // Show welcome message on mount
    const welcomeCommand: Command = {
      input: '',
      output: [
        'Welcome to Vyakart\'s Terminal!',
        'Type "help" to see available commands.',
        'Explore the file system and learn more about me.',
        ''
      ],
      timestamp: new Date().toLocaleTimeString()
    }
    setHistory([welcomeCommand])
  }, [])

  const prompt = `vyakart@portfolio:${currentPath}$`

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Terminal
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Interactive terminal interface. Explore my portfolio through command line!
          </p>
        </div>

        {/* Terminal Window */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-slate-800 px-4 py-3 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-slate-400 text-sm font-mono">terminal — vyakart@portfolio</span>
            </div>
          </div>

          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="p-6 h-96 overflow-y-auto font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Command History */}
            <AnimatePresence>
              {history.map((command, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  {command.input && (
                    <div className="text-green-400 mb-1">
                      <span className="text-blue-400">{prompt}</span> {command.input}
                    </div>
                  )}
                  {command.output.map((line, lineIndex) => (
                    <div key={lineIndex} className="text-gray-300 leading-relaxed">
                      {line}
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Current Input */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-blue-400 mr-2">{prompt}</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                autoComplete="off"
                spellCheck={false}
              />
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-green-400 ml-1"
              >
                █
              </motion.span>
            </form>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-xs mt-2"
              >
                Processing...
              </motion.div>
            )}
          </div>
        </div>

        {/* Terminal Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Type <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">help</code> to see all commands</li>
              <li>• Use <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">ls</code> to explore directories</li>
              <li>• Try <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">whoami</code> to learn about me</li>
              <li>• Click anywhere in the terminal to focus</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🚀 Try These
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">cat about.md</code></li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">tree</code></li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">echo "Hello World!"</code></li>
              <li>• <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">date</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}