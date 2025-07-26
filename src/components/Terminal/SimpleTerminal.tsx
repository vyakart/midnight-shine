import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  handleCommand,
  getCommandSuggestions,
} from './commandHandler';
import type {
  CommandHistoryEntry,
  TerminalConfig,
  CommandOutput
} from '../../types/terminal';

// Simple ID generator
let idCounter = 0;
const generateId = () => `cmd-${Date.now()}-${++idCounter}`;

interface SimpleTerminalProps extends Partial<TerminalConfig> {
  className?: string;
}

const defaultConfig: TerminalConfig = {
  prompt: 'visitor@portfolio:~$',
  welcomeMessage: (
    <div className="text-green-400">
      <div className="text-2xl font-bold mb-4">MIDNIGHT SHINE Terminal</div>
      <div className="mb-4">
        <p>Welcome to my terminal-based portfolio!</p>
        <p className="mt-2">Type <span className="text-cyan-400 font-mono bg-gray-800 px-1 rounded">help</span> to see available commands.</p>
        <p>Use <span className="text-cyan-400 font-mono bg-gray-800 px-1 rounded">Tab</span> for auto-completion and arrow keys for history.</p>
      </div>
    </div>
  ),
  maxHistorySize: 100,
  animationSpeed: 30,
  theme: 'dark',
};

export const SimpleTerminal: React.FC<SimpleTerminalProps> = ({
  className = '',
  ...config
}) => {
  const navigate = useNavigate();
  const terminalConfig = { ...defaultConfig, ...config };
  
  // State
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/home');
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  
  // Add welcome message on mount
  useEffect(() => {
    if (terminalConfig.welcomeMessage) {
      const welcomeEntry: CommandHistoryEntry = {
        id: generateId(),
        command: '',
        output: {
          content: terminalConfig.welcomeMessage,
          type: 'system',
          animate: false,
        },
        timestamp: new Date(),
        directory: currentDirectory,
      };
      setHistory([welcomeEntry]);
    }
  }, [terminalConfig.welcomeMessage, currentDirectory]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);
  
  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };
  
  // Handle command execution
  const executeCommand = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    const output = await handleCommand(input, currentDirectory);
    
    // Handle system commands
    if (output.type === 'system') {
      const content = output.content as string;
      
      if (content === 'CLEAR_TERMINAL') {
        setHistory([]);
        setCurrentInput('');
        setIsProcessing(false);
        return;
      }
      
      if (content.startsWith('NAVIGATE:')) {
        const path = content.replace('NAVIGATE:', '');
        navigate(path);
        setIsProcessing(false);
        return;
      }
      
      if (content.startsWith('CHANGE_DIRECTORY:')) {
        const newDir = content.replace('CHANGE_DIRECTORY:', '');
        setCurrentDirectory(newDir);
      }
    }
    
    const entry: CommandHistoryEntry = {
      id: generateId(),
      command: input,
      output,
      timestamp: new Date(),
      directory: currentDirectory,
    };
    
    setHistory(prev => {
      const newHistory = [...prev, entry];
      if (newHistory.length > terminalConfig.maxHistorySize!) {
        return newHistory.slice(-terminalConfig.maxHistorySize!);
      }
      return newHistory;
    });
    
    setCurrentInput('');
    setHistoryIndex(-1);
    setIsProcessing(false);
  }, [currentDirectory, navigate, terminalConfig.maxHistorySize]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);
    
    // Update suggestions
    if (value.trim()) {
      const suggestions = getCommandSuggestions(value);
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab for autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (showSuggestions && suggestions.length > 0) {
        setCurrentInput(suggestions[selectedSuggestion]);
        setShowSuggestions(false);
      } else if (currentInput.trim()) {
        const suggestions = getCommandSuggestions(currentInput);
        if (suggestions.length === 1) {
          setCurrentInput(suggestions[0]);
        } else if (suggestions.length > 1) {
          setSuggestions(suggestions);
          setShowSuggestions(true);
        }
      }
    }
    
    // Enter to execute command
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (!isProcessing) {
        executeCommand(currentInput);
      }
    }
    
    // Arrow keys for history navigation
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commandHistory = history.filter(h => h.command).map(h => h.command);
      
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    }
    
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (historyIndex > 0) {
        const commandHistory = history.filter(h => h.command).map(h => h.command);
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        
        if (newIndex === -1) {
          setCurrentInput('');
        } else {
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    }
    
    // Ctrl+L to clear
    else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      executeCommand('clear');
    }
    
    // Escape to close suggestions
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
    
    // Navigate suggestions
    else if (showSuggestions) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    }
  };
  
  // Render output
  const renderOutput = (output: CommandOutput) => {
    const content = output.content;
    
    if (typeof content === 'string') {
      if (output.isHTML) {
        return (
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
      
      return (
        <div className="whitespace-pre-wrap">{content}</div>
      );
    }
    
    return content;
  };
  
  return (
    <div
      className={`bg-black text-green-400 font-mono text-sm p-6 rounded-lg border border-green-500/30 shadow-lg ${className}`}
      onClick={handleTerminalClick}
      style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto' }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-green-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-green-400/70 text-xs">
          Simple Terminal - Portfolio
        </div>
      </div>
      
      {/* Terminal Content */}
      <div ref={terminalRef} className="space-y-2">
        {/* Command History */}
        {history.map((entry) => (
          <div key={entry.id} className="terminal-entry">
            {entry.command && (
              <div className="flex items-center space-x-2 text-green-400">
                <span className="text-cyan-400">{terminalConfig.prompt}</span>
                <span>{entry.command}</span>
              </div>
            )}
            
            <div className={`mt-1 ${
              entry.output.type === 'error' ? 'text-red-400' :
              entry.output.type === 'warning' ? 'text-yellow-400' :
              entry.output.type === 'success' ? 'text-green-400' :
              'text-gray-300'
            }`}>
              {renderOutput(entry.output)}
            </div>
          </div>
        ))}
        
        {/* Processing State */}
        {isProcessing && (
          <div className="text-yellow-400 animate-pulse">
            Processing...
          </div>
        )}
        
        {/* Current Input Line */}
        <div className="flex items-center space-x-2 relative">
          <span className="text-cyan-400">{terminalConfig.prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 outline-none border-none"
            spellCheck={false}
            autoComplete="off"
            disabled={isProcessing}
            style={{
              caretColor: '#00ff41' // Show native cursor in green
            }}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-green-500/30 rounded z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`px-3 py-1 cursor-pointer ${
                    index === selectedSuggestion ? 'bg-green-500/20' : 'hover:bg-green-500/10'
                  }`}
                  onClick={() => {
                    setCurrentInput(suggestion);
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Scroll anchor */}
        <div ref={outputEndRef} />
      </div>
    </div>
  );
};

export default SimpleTerminal;