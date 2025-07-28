import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

interface CyberpunkTerminalProps {
  className?: string;
}

const CyberpunkTerminal: React.FC<CyberpunkTerminalProps> = ({ className = '' }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ASCII universe from vyakart_cli.py
  const universeLines = [
    "                                 .           *       .               .",
    "                    .                     .             .          .",
    "        .                .       .              *             .        ",
    "              .       *       .       .                 .         *   ",
    "    .       .       .            .            .       .    .         ",
    "             .         .   .  *      .   .             *      .       ",
    "        *      .     .    .       .     .    .      .     .         ",
    "   .             .        .    .        *       .         .         ",
    "          .    .      .        .       .      .      .      .        ",
    "             .         .    *      .        .   .        .           ",
    "                 .       .        .   .      .        .       *      ",
    "       .    .        .        .       .         .     .      .       ",
  ];

  // Translations from vyakart_cli.py
  const translations = [
    { language: "English", word: "Vyakart" },
    { language: "Kannada", word: "ಸೃಷ್ಟಿಕರ್ತ" },
    { language: "Chakma", word: "সৃষ্টিকর্তা" },
    { language: "Japanese", word: "クリエイター" },
    { language: "Sanskrit", word: "व्याकर्तृ" },
    { language: "Arabic", word: "المنشئ" },
    { language: "Russian", word: "создатель" },
    { language: "Chinese", word: "创造者" },
    { language: "Portuguese", word: "O Criador" },
    { language: "Yoruba", word: "Eleda" },
  ];

  const colors = ['text-terminal-green', 'text-terminal-cyan', 'text-terminal-purple', 'text-yellow-400', 'text-red-400'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized || !showSplash) return;

    const showUniverse = async () => {
      for (let i = 0; i < universeLines.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setCurrentLine(i + 1);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTimeout(() => {
        setShowSplash(false);
        addSystemMessage("Welcome to Vyakart CLI Chat. Type 'help' for available commands.");
      }, 2000);
    };

    showUniverse();
  }, [isInitialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addSystemMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    handleCommand(input.toLowerCase().trim());
    setInput('');
  };

  const handleCommand = (command: string) => {
    switch (command) {
      case 'help':
        addBotMessage(`Available commands:
• help - Show this help message
• about - Learn about Vyakart
• skills - View technical skills
• projects - List recent projects
• contact - Get contact information  
• clear - Clear terminal history
• matrix - Toggle matrix rain effect`);
        break;
      case 'about':
        addBotMessage(`I'm a creator, developer, and digital architect. The name "Vyakart" comes from Sanskrit meaning "one who brings forth" or "creator". I specialize in building meaningful digital experiences through code, design, and thoughtful problem-solving.`);
        break;
      case 'skills':
        addBotMessage(`Core Technologies:
• Frontend: React, TypeScript, Next.js, Tailwind CSS
• Backend: Node.js, Python, PostgreSQL, Redis
• Cloud: AWS, Docker, Kubernetes
• Design: Figma, Framer, Three.js
• AI/ML: PyTorch, TensorFlow, Hugging Face`);
        break;
      case 'projects':
        addBotMessage(`Recent Work:
• Midnight Shine Portfolio - Modern React portfolio with Three.js
• AI Chat Interface - Real-time chat with Claude integration  
• E-commerce Platform - Full-stack Next.js application
• Design System - Component library with Storybook
• API Gateway - Microservices architecture with Node.js`);
        break;
      case 'contact':
        addBotMessage(`Connect with me:
• Email: hello@vyakart.dev
• GitHub: github.com/vyakart
• LinkedIn: linkedin.com/in/vyakart
• Twitter: @vyakart_dev
• Portfolio: vyakart.dev`);
        break;
      case 'clear':
        setMessages([]);
        addSystemMessage("Terminal cleared. Type 'help' for available commands.");
        break;
      case 'matrix':
        addBotMessage("Matrix rain effect toggled! ⚡ The digital world flows around us...");
        break;
      default:
        addBotMessage(`Command '${command}' not recognized. Type 'help' to see available commands.`);
    }
  };

  return (
    <div className={`bg-terminal-bg border border-terminal-cyan rounded-lg overflow-hidden font-mono text-sm ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-terminal-surface p-3 border-b border-terminal-cyan/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
        </div>
        <div className="text-terminal-cyan text-xs">vyakart@terminal:~$</div>
      </div>

      {/* Terminal Content */}
      <div className="h-96 overflow-y-auto bg-terminal-bg p-4">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {/* Universe Animation */}
              {universeLines.slice(0, currentLine).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-terminal-cyan font-mono whitespace-pre"
                >
                  {line}
                </motion.div>
              ))}

              {/* Title */}
              {currentLine >= universeLines.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center py-4"
                >
                  <div className="text-terminal-purple text-xl font-bold">
                    === VYAKART ===
                  </div>
                </motion.div>
              )}

              {/* Translations */}
              {currentLine >= universeLines.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-1"
                >
                  {translations.map((translation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className={`${colors[index % colors.length]}`}
                    >
                      <span className="inline-block w-16">{translation.language}</span>
                      <span className="text-terminal-text"> : {translation.word}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {/* Chat Messages */}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-2"
                >
                  <span
                    className={`inline-block min-w-0 flex-shrink-0 ${
                      message.type === 'user'
                        ? 'text-terminal-green'
                        : message.type === 'bot'
                        ? 'text-terminal-cyan'
                        : 'text-terminal-purple'
                    }`}
                  >
                    {message.type === 'user' ? '>' : message.type === 'bot' ? '→' : '◦'}
                  </span>
                  <span
                    className={`flex-1 whitespace-pre-wrap ${
                      message.type === 'user'
                        ? 'text-terminal-green'
                        : message.type === 'bot'
                        ? 'text-terminal-text'
                        : 'text-terminal-muted'
                    }`}
                  >
                    {message.content}
                  </span>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-terminal-cyan"
                >
                  <span>→</span>
                  <span className="flex space-x-1">
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
                    >
                      ●
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                    >
                      ●
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                    >
                      ●
                    </motion.span>
                  </span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-terminal-cyan/30 bg-terminal-surface p-3"
        >
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-terminal-green">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-terminal-text placeholder-terminal-muted focus:outline-none"
              placeholder="Type a command..."
              autoFocus
            />
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-4 bg-terminal-green"
            />
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default CyberpunkTerminal;