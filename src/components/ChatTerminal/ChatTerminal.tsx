import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import { useFilesystem } from '../../hooks/useFilesystem';
import { useChatCompletion } from '../../hooks/useChatCompletion';
import { executeCommand } from '../../utils/terminal/commands';
import type { TerminalAPI } from '../../types/terminal';
import '@xterm/xterm/css/xterm.css';
import './ChatTerminal.css';

interface ChatTerminalProps {
  className?: string;
  initialTheme?: 'dark' | 'light' | 'retro';
  soundEnabled?: boolean;
}

export const ChatTerminal: React.FC<ChatTerminalProps> = ({
  className = '',
  initialTheme = 'dark',
  soundEnabled = true,
}) => {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<string>('');
  const cursorPositionRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const [isMuted, setIsMuted] = useState(!soundEnabled);
  
  const {
    terminal,
    isReady,
    createTerminal,
    write,
    writeln,
    clear,
    setTheme,
    focus,
    fit,
    addToHistory,
    navigateHistory,
    autocomplete,
  } = useTerminal({ theme: initialTheme, soundEnabled });

  const { filesystem, getCurrentPath } = useFilesystem();
  const { sendMessage } = useChatCompletion();

  // Play sound effect
  const playSound = useCallback((soundType: 'keystroke' | 'error' | 'success') => {
    if (isMuted) return;
    
    // Create audio context and play sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (soundType) {
      case 'keystroke':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.05;
        break;
      case 'error':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.1;
        break;
      case 'success':
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.08;
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  }, [isMuted]);

  // Write prompt
  const writePrompt = useCallback(() => {
    const path = getCurrentPath();
    const prompt = `\x1b[1;32mnishitos\x1b[0m:\x1b[1;34m${path}\x1b[0m$ `;
    write(prompt);
  }, [getCurrentPath, write]);

  // Handle command execution
  const handleCommand = useCallback(async (command: string) => {
    const trimmedCommand = command.trim();
    
    if (!trimmedCommand) {
      writeln('');
      writePrompt();
      return;
    }

    addToHistory(trimmedCommand);

    // Check if it's a Nishito chat command
    if (trimmedCommand.startsWith('nishito ')) {
      const query = trimmedCommand.slice(8);
      writeln('');
      write('\x1b[1;36mNishito:\x1b[0m ');
      
      try {
        await sendMessage(query, (chunk) => {
          write(chunk);
        });
        writeln('');
      } catch (error) {
        writeln(`\n\x1b[1;31mError: ${error}\x1b[0m`);
        playSound('error');
      }
      
      writePrompt();
      return;
    }

    // Parse command and arguments
    const parts = trimmedCommand.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    writeln('');

    // Handle special commands
    if (cmd === 'theme' && args.length > 0) {
      setTheme(args[0]);
      playSound('success');
    } else if (cmd === 'exit') {
      writeln('\x1b[1;33mGoodbye! 👋\x1b[0m');
      // In a real app, you might close the terminal or navigate away
      return;
    } else if (cmd === 'mute') {
      setIsMuted(!isMuted);
      writeln(`Sound ${isMuted ? 'enabled' : 'muted'}`);
    } else {
      // Execute regular command
      try {
        await executeCommand(cmd, args, terminal!, filesystem);
        playSound('success');
      } catch (error) {
        playSound('error');
      }
    }

    writePrompt();
  }, [
    writeln,
    write,
    writePrompt,
    addToHistory,
    setTheme,
    terminal,
    filesystem,
    sendMessage,
    playSound,
    isMuted,
  ]);

  // Stable data handler callback
  const handleTerminalData = useCallback((data: string) => {
    switch (data) {
      case '\r': // Enter
        handleCommand(currentLineRef.current);
        currentLineRef.current = '';
        cursorPositionRef.current = 0;
        break;
        
      case '\u0003': // Ctrl+C
        write('^C\n');
        currentLineRef.current = '';
        cursorPositionRef.current = 0;
        writePrompt();
        break;
        
      case '\u007F': // Backspace
        if (cursorPositionRef.current > 0) {
          currentLineRef.current =
            currentLineRef.current.slice(0, cursorPositionRef.current - 1) +
            currentLineRef.current.slice(cursorPositionRef.current);
          cursorPositionRef.current--;
          
          // Rewrite the line
          write('\x1b[2K\r'); // Clear line and return to start
          writePrompt();
          write(currentLineRef.current);
          
          // Move cursor to correct position
          if (cursorPositionRef.current < currentLineRef.current.length) {
            write(`\x1b[${currentLineRef.current.length - cursorPositionRef.current}D`);
          }
          
          playSound('keystroke');
        }
        break;
        
      case '\t': // Tab (autocomplete)
        if (currentLineRef.current) {
          const result = autocomplete(currentLineRef.current);
          if (result.completions.length === 1) {
            currentLineRef.current = result.completions[0];
            cursorPositionRef.current = currentLineRef.current.length;
            
            write('\x1b[2K\r');
            writePrompt();
            write(currentLineRef.current);
          } else if (result.completions.length > 1) {
            writeln('');
            result.completions.forEach(cmd => {
              writeln(`  ${cmd}`);
            });
            writePrompt();
            write(currentLineRef.current);
          }
        }
        break;
        
      case '\x1b[A': // Up arrow
        const prevCommand = navigateHistory('up');
        if (prevCommand !== null) {
          currentLineRef.current = prevCommand;
          cursorPositionRef.current = prevCommand.length;
          
          write('\x1b[2K\r');
          writePrompt();
          write(currentLineRef.current);
        }
        break;
        
      case '\x1b[B': // Down arrow
        const nextCommand = navigateHistory('down');
        if (nextCommand !== null) {
          currentLineRef.current = nextCommand;
          cursorPositionRef.current = nextCommand.length;
          
          write('\x1b[2K\r');
          writePrompt();
          write(currentLineRef.current);
        }
        break;
        
      default:
        // Regular character input
        if (data.length === 1 && data.charCodeAt(0) >= 32) {
          currentLineRef.current =
            currentLineRef.current.slice(0, cursorPositionRef.current) +
            data +
            currentLineRef.current.slice(cursorPositionRef.current);
          cursorPositionRef.current++;
          
          write(data);
          
          // If we're not at the end of the line, rewrite the rest
          if (cursorPositionRef.current < currentLineRef.current.length) {
            const remaining = currentLineRef.current.slice(cursorPositionRef.current);
            write(remaining);
            write(`\x1b[${remaining.length}D`);
          }
          
          playSound('keystroke');
        }
        break;
    }
  }, [write, writeln, writePrompt, handleCommand, navigateHistory, autocomplete, playSound]);

  // Initialize terminal
  useEffect(() => {
    if (!terminalContainerRef.current || !isReady || !terminal || isInitializedRef.current) return;

    // Write welcome message only once
    isInitializedRef.current = true;
    writeln('\x1b[1;35m╔════════════════════════════════════════╗\x1b[0m');
    writeln('\x1b[1;35m║      Welcome to NishiOS Terminal!      ║\x1b[0m');
    writeln('\x1b[1;35m╚════════════════════════════════════════╝\x1b[0m');
    writeln('');
    writeln('Type \x1b[1;32mhelp\x1b[0m for available commands');
    writeln('Prefix any message with \x1b[1;36mnishito\x1b[0m to chat with AI');
    writeln('');
    writePrompt();

    // Focus terminal
    focus();
  }, [isReady, terminal, writeln, writePrompt, focus]);

  // Handle terminal input - separate effect
  useEffect(() => {
    if (!terminal || !isReady) return;

    const dataDisposable = terminal.onData(handleTerminalData);

    // Cleanup function to dispose of event handler
    return () => {
      dataDisposable.dispose();
    };
  }, [terminal, isReady, handleTerminalData]);

  // Create terminal when container is ready
  useEffect(() => {
    if (terminalContainerRef.current && !terminal) {
      createTerminal(terminalContainerRef.current);
    }
  }, [createTerminal, terminal]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => fit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fit]);

  // Expose terminal API
  useEffect(() => {
    const api: TerminalAPI = {
      send: (text: string) => {
        if (isReady) {
          writeln(text);
        }
      },
      clear: () => {
        if (isReady) {
          clear();
        }
      },
      setTheme: (themeName: string) => {
        if (isReady) {
          setTheme(themeName);
        }
      },
    };

    (window as any).terminalApi = api;

    return () => {
      delete (window as any).terminalApi;
    };
  }, [isReady, writeln, clear, setTheme]);

  return (
    <div className={`chat-terminal ${className}`}>
      <div className="terminal-header">
        <div className="terminal-title">NishiOS Terminal</div>
        <div className="terminal-controls">
          <button 
            className="terminal-control-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button 
            className="terminal-control-btn"
            onClick={() => clear()}
            title="Clear"
          >
            🗑️
          </button>
          <button 
            className="terminal-control-btn minimize"
            title="Minimize"
          >
            —
          </button>
          <button 
            className="terminal-control-btn maximize"
            title="Maximize"
          >
            □
          </button>
          <button 
            className="terminal-control-btn close"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div 
        ref={terminalContainerRef} 
        className="terminal-container"
      />
    </div>
  );
};

export default ChatTerminal;