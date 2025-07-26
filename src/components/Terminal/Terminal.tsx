import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  handleCommand,
  getCommandSuggestions,
  availableCommands
} from './commandHandler';
import type {
  CommandHistoryEntry,
  TerminalConfig,
  CommandOutput
} from '../../types/terminal';
import { useTerminalEffects } from '../../hooks/useTerminalEffects';
import { TypingAnimation } from '../animations/TypingAnimation';
import { LoadingDots } from '../animations/LoadingDots';
import { MatrixRain } from './effects/MatrixRain';
import { GlitchText } from './effects/GlitchText';
import { ScanLines } from './effects/ScanLines';
import { ParticleField } from './effects/ParticleField';

// Simple ID generator
let idCounter = 0;
const generateId = () => `cmd-${Date.now()}-${++idCounter}`;

interface TerminalProps extends Partial<TerminalConfig> {
  className?: string;
  enableBootSequence?: boolean;
  enableEffects?: boolean;
}

const defaultConfig: TerminalConfig = {
  prompt: 'visitor@portfolio:~$',
  welcomeMessage: (
    <div className="text-green-400">
      <pre className="terminal-ascii text-xs sm:text-sm">
{`
███╗   ███╗██╗██████╗ ███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗
████╗ ████║██║██╔══██╗████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝
██╔████╔██║██║██║  ██║██╔██╗ ██║██║██║  ███╗███████║   ██║   
██║╚██╔╝██║██║██║  ██║██║╚██╗██║██║██║   ██║██╔══██║   ██║   
██║ ╚═╝ ██║██║██████╔╝██║ ╚████║██║╚██████╔╝██║  ██║   ██║   
╚═╝     ╚═╝╚═╝╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
`}
      </pre>
      <div className="mt-4 text-sm">
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

export const Terminal: React.FC<TerminalProps> = ({
  className = '',
  enableBootSequence = true,
  enableEffects = true,
  ...config
}) => {
  const navigate = useNavigate();
  const terminalConfig = { ...defaultConfig, ...config };
  
  // Effects hook
  const {
    effects,
    settings,
    toggleEffect,
    enableEffect,
    disableEffect,
    triggerScreenFlicker,
    triggerBootSequence,
    isPerformanceMode
  } = useTerminalEffects();
  
  // State
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/home');
  const [isBootComplete, setIsBootComplete] = useState(!enableBootSequence);
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const cursorBlinkRef = useRef<number | undefined>(undefined);
  
  // Enhanced cursor blinking with realistic timing
  useEffect(() => {
    const startCursorBlink = () => {
      cursorBlinkRef.current = window.setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 530 + Math.random() * 70); // Slight randomization for realism
    };

    startCursorBlink();
    return () => {
      if (cursorBlinkRef.current) {
        clearInterval(cursorBlinkRef.current);
      }
    };
  }, []);

  // Boot sequence on mount
  useEffect(() => {
    if (enableBootSequence && enableEffects) {
      triggerBootSequence();
      
      const bootTimer = setTimeout(() => {
        setIsBootComplete(true);
        
        // Add welcome message after boot sequence
        if (terminalConfig.welcomeMessage) {
          const welcomeEntry: CommandHistoryEntry = {
            id: generateId(),
            command: '',
            output: {
              content: terminalConfig.welcomeMessage,
              type: 'system',
              animate: true,
            },
            timestamp: new Date(),
            directory: currentDirectory,
          };
          setHistory([welcomeEntry]);
        }
      }, 3000);

      return () => clearTimeout(bootTimer);
    } else {
      // Add welcome message immediately if no boot sequence
      if (terminalConfig.welcomeMessage) {
        const welcomeEntry: CommandHistoryEntry = {
          id: generateId(),
          command: '',
          output: {
            content: terminalConfig.welcomeMessage,
            type: 'system',
            animate: true,
          },
          timestamp: new Date(),
          directory: currentDirectory,
        };
        setHistory([welcomeEntry]);
      }
    }
  }, [enableBootSequence, enableEffects, triggerBootSequence, terminalConfig.welcomeMessage, currentDirectory]);
  
  // Enhanced smooth scrolling with performance optimization
  useEffect(() => {
    const scrollToBottom = () => {
      if (outputEndRef.current && terminalRef.current) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          outputEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        });
      }
    };

    // Debounce scroll updates for performance
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [history]);
  
  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };
  
  // Handle command execution with enhanced effects
  const executeCommand = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    // Trigger screen flicker effect when executing commands
    if (enableEffects && effects.screenFlicker) {
      triggerScreenFlicker(200);
    }
    
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
      
      if (content.startsWith('THEME:')) {
        const theme = content.replace('THEME:', '');
        // Handle theme change here
        console.log('Theme change:', theme);
      }
      
      if (content.startsWith('MATRIX:')) {
        const action = content.replace('MATRIX:', '');
        if (action === 'ON') {
          enableEffect('matrixRain');
        } else if (action === 'OFF') {
          disableEffect('matrixRain');
        }
      }
      
      if (content.startsWith('EFFECTS:')) {
        const action = content.replace('EFFECTS:', '');
        const [effectName, state] = action.split(':');
        if (state === 'ON') {
          enableEffect(effectName as keyof typeof effects);
        } else if (state === 'OFF') {
          disableEffect(effectName as keyof typeof effects);
        }
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
      // Limit history size
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
  
  // Enhanced render output with typing animation and glitch effects
  const renderOutput = (output: CommandOutput, animate: boolean = true) => {
    const content = output.content;
    const shouldAnimate = animate && output.animate && !isPerformanceMode;
    const shouldGlitch = effects.glitchText && output.type === 'error';
    
    if (typeof content === 'string') {
      if (output.isHTML) {
        return (
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
      
      if (shouldGlitch) {
        return (
          <GlitchText
            text={content}
            isActive={true}
            intensity={settings.intensity}
            className="whitespace-pre-wrap"
          />
        );
      }
      
      if (shouldAnimate) {
        return (
          <TypingAnimation
            text={content}
            speed={settings.speed === 'fast' ? 25 : settings.speed === 'slow' ? 75 : 50}
            preserveWhitespace={true}
            className="whitespace-pre-wrap"
            cursor={false}
          />
        );
      }
      
      return (
        <div className="whitespace-pre-wrap">
          {content}
        </div>
      );
    }
    
    return content;
  };
  
  return (
    <div
      className={`terminal-window-enhanced relative overflow-hidden ${className} ${
        // Atmospheric effects based on terminal state
        isProcessing ? 'terminal-state-active terminal-activity-pulse active' :
        !isBootComplete ? 'terminal-state-boot terminal-power-on' :
        'terminal-state-idle terminal-standby-glow'
      } ${
        // Core atmospheric classes
        'terminal-atmospheric-glow terminal-depth-shadow terminal-ambient-light'
      } ${
        // Environmental effects
        effects.screenFlicker ? 'terminal-screen-flicker' : ''
      } ${
        // Screen reflection and particles
        'terminal-screen-reflection terminal-dust-motes terminal-light-rays'
      } ${
        // Enhanced CRT effects
        'terminal-crt-enhanced terminal-burn-in'
      } ${
        // Performance optimizations
        isPerformanceMode ? 'terminal-performance-mode' : 'terminal-gpu-accelerated'
      }`}
      onClick={handleTerminalClick}
      style={{
        // Dynamic color temperature based on activity
        filter: isProcessing
          ? 'brightness(1.1) contrast(1.1) saturate(1.05)'
          : effects.screenFlicker
          ? 'brightness(1.05) contrast(1.02)'
          : 'brightness(1) contrast(1)',
      }}
    >
      {/* Background Effects Layer */}
      {enableEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Matrix Rain Effect */}
          <MatrixRain
            isActive={effects.matrixRain}
            intensity={settings.intensity}
            className="z-0"
          />
          
          {/* Particle Field Effect */}
          <ParticleField
            isActive={effects.particleField}
            intensity={settings.intensity}
            particleCount={isPerformanceMode ? 20 : 50}
            className="z-0"
          />
          
          {/* Scan Lines Effect */}
          <ScanLines
            isActive={effects.scanLines}
            intensity={settings.intensity}
            speed={settings.speed}
            className="z-10"
          />
        </div>
      )}
      
      {/* Terminal Header */}
      <div className="terminal-header relative z-20">
        <div className="terminal-controls">
          <button
            className="terminal-control terminal-control-close"
            aria-label="Close"
            onClick={() => toggleEffect('matrixRain')}
          />
          <button
            className="terminal-control terminal-control-minimize"
            aria-label="Minimize"
            onClick={() => toggleEffect('particleField')}
          />
          <button
            className="terminal-control terminal-control-maximize"
            aria-label="Maximize"
            onClick={() => toggleEffect('scanLines')}
          />
        </div>
        <div className="terminal-title">
          {effects.glitchText ? (
            <GlitchText
              text="Terminal - Portfolio"
              isActive={true}
              intensity="low"
              duration={2000}
            />
          ) : (
            'Terminal - Portfolio'
          )}
        </div>
      </div>
      
      {/* Boot Sequence Overlay */}
      {enableBootSequence && effects.bootSequence && !isBootComplete && (
        <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-green-400 font-mono text-center">
            <TypingAnimation
              text={[
                'INITIALIZING TERMINAL...',
                'LOADING SYSTEM MODULES...',
                'ESTABLISHING CONNECTION...',
                'BOOT SEQUENCE COMPLETE'
              ]}
              speed={30}
              pauseBetween={800}
              className="text-lg"
            />
            <div className="mt-4">
              <LoadingDots
                variant="matrix"
                text="BOOTING"
                speed="normal"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className={`terminal-content relative z-20 ${
          // Enhanced atmospheric effects for content
          'terminal-depth-blur'
        } ${
          // Dynamic color temperature based on terminal state
          isProcessing ? 'terminal-color-temp-cool' :
          !isBootComplete ? 'terminal-color-temp-warm' :
          'terminal-color-temp-neutral'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(1px)',
        }}
      >
        {/* Command History */}
        <div className="space-y-2">
          {history.map((entry) => (
            <div key={entry.id} className="terminal-entry">
              {entry.command && (
                <div className="terminal-prompt-line">
                  <span className="terminal-prompt">
                    {terminalConfig.prompt}
                  </span>
                  <span className="terminal-command-text">{entry.command}</span>
                </div>
              )}
              
              <div className={`terminal-output terminal-output-${entry.output.type || 'info'}`}>
                {renderOutput(entry.output)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Processing State */}
        {isProcessing && (
          <div className="terminal-prompt-line">
            <LoadingDots
              variant="terminal"
              text="Processing"
              speed={settings.speed}
              size="sm"
            />
          </div>
        )}
        
        {/* Current Input Line */}
        {isBootComplete && (
          <div className="terminal-prompt-line relative">
            <span className="terminal-prompt">
              {terminalConfig.prompt}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="terminal-input bg-transparent"
              spellCheck={false}
              autoComplete="off"
              disabled={isProcessing}
              style={{
                caretColor: 'transparent' // Hide default cursor
              }}
            />
            {/* Enhanced Cursor */}
            <span
              className={`terminal-cursor inline-block w-2 h-5 bg-green-400 ml-1 ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-100`}
              style={{
                boxShadow: effects.ambientGlow ? '0 0 5px #00ff41' : 'none'
              }}
            >
              █
            </span>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="terminal-suggestions bg-black/90 backdrop-blur-sm border border-green-500/30">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`terminal-suggestion ${
                      index === selectedSuggestion ? 'selected bg-green-500/20' : ''
                    } hover:bg-green-500/10 transition-colors`}
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
        )}
        
        {/* Accessibility Info */}
        {settings.accessibilityMode && (
          <div className="text-xs text-gray-500 mt-2 opacity-50">
            Accessibility mode enabled - Visual effects reduced
          </div>
        )}
        
        {/* Performance Mode Info */}
        {isPerformanceMode && (
          <div className="text-xs text-yellow-500 mt-2 opacity-50">
            Performance mode active - Some effects disabled
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={outputEndRef} />
      </div>
    </div>
  );
};

export default Terminal;