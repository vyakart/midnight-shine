import React, { useState, useRef, useEffect } from 'react'

/* ---------- Interactive Terminal Hero Component ---------- */
export default function Hero() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState(['Welcome to Vyakart\'s portfolio terminal. Type "help" for commands.'])
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTerminalOpen])

  const commands = {
    help: () => 'Available commands: about, writing, resources, contact, clear, whoami',
    about: () => 'Creative developer bridging art and technology. Navigate to /about for full story.',
    writing: () => 'Thoughts on design, code, and digital creativity. Navigate to /writing to read more.',
    resources: () => 'Curated tools and inspiration for developers. Check out /resources.',
    contact: () => 'Let\'s build something together. Find me at /contact.',
    whoami: () => 'Vyakart - Designer, Developer, Digital Artist',
    clear: () => null, // Special case handled separately
  }

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()
    
    if (command === 'clear') {
      setOutput([])
      return
    }

    const response = commands[command as keyof typeof commands]
    const newOutput = [
      ...output,
      `> ${cmd}`,
      response ? response() : `Command not found: ${cmd}. Type "help" for available commands.`
    ]
    
    setOutput(newOutput)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput('')
    }
  }

  return (
    <section className="relative isolate h-screen w-full overflow-hidden">
      {/* High-Quality Animated Video Background */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover object-center"
          style={{
            filter: 'contrast(1.1) saturate(1.1)',
            imageRendering: 'crisp-edges',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          disablePictureInPicture
        >
          <source 
            src="/images/TensorPix - hero.mp4" 
            type="video/mp4" 
          />
          {/* Fallback to GIF if video doesn't load */}
          <img
            src="/images/vyakart_Create_a_hero_for_a_website_that_indicates_a_bridge_c_1240ecbe-daa0-41f7-8c83-2f6b6598fa87_3.gif"
            alt="Animated hero illustration showing a bridge concept with vibrant colors"
            className="h-full w-full object-cover object-center"
          />
        </video>
      </div>

      {/* Interactive Terminal Overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        {!isTerminalOpen ? (
          /* Terminal Icon */
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="bg-black/80 hover:bg-black/90 text-green-400 p-3 rounded-lg backdrop-blur-sm border border-green-400/30 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
            title="Open terminal"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V8h16v10H4z"/>
              <path d="m6.5 12.5 3-3-3-3 1.5-1.5L12.5 9.5 8 14z"/>
              <rect x="12" y="13" width="8" height="2"/>
            </svg>
          </button>
        ) : (
          /* Terminal Window */
          <div className="bg-black/90 backdrop-blur-md border border-green-400/30 rounded-lg w-96 h-64 flex flex-col font-mono text-sm">
            {/* Terminal Header */}
            <div className="bg-gray-800/80 px-3 py-2 flex items-center justify-between border-b border-green-400/30 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-xs">vyakart@portfolio:~$</span>
              <button
                onClick={() => setIsTerminalOpen(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-3 overflow-y-auto">
              {output.map((line, index) => (
                <div key={index} className={`text-green-400 ${line.startsWith('>') ? 'text-white' : ''}`}>
                  {line}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-green-400/30">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
                  placeholder="Type a command..."
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
} 