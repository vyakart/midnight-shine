import { useRef, useEffect, useCallback, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import type { TerminalConfig, CommandHistory, AutocompleteResult } from '../types/terminal';
import { getTheme } from '../utils/terminal/themes';
import { getAvailableCommands } from '../utils/terminal/commands';

export function useTerminal(config: Partial<TerminalConfig> = {}) {
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [history, setHistory] = useState<CommandHistory>({
    commands: [],
    currentIndex: -1,
  });

  const defaultConfig: TerminalConfig = {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    rows: 24,
    cols: 80,
    cursorBlink: true,
    cursorStyle: 'block',
    soundEnabled: true,
    ...config,
  };

  const createTerminal = useCallback((element: HTMLDivElement) => {
    if (terminalRef.current) return;

    const terminal = new Terminal({
      fontSize: defaultConfig.fontSize,
      fontFamily: defaultConfig.fontFamily,
      rows: defaultConfig.rows,
      cols: defaultConfig.cols,
      cursorBlink: defaultConfig.cursorBlink,
      cursorStyle: defaultConfig.cursorStyle,
      theme: getTheme(defaultConfig.theme),
      scrollback: 1000,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);
    
    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    terminal.open(element);
    fitAddon.fit();

    setIsReady(true);
  }, [defaultConfig]);

  const write = useCallback((text: string) => {
    terminalRef.current?.write(text);
  }, []);

  const writeln = useCallback((text: string) => {
    terminalRef.current?.writeln(text);
  }, []);

  const clear = useCallback(() => {
    terminalRef.current?.clear();
  }, []);

  const setTheme = useCallback((themeName: string) => {
    if (terminalRef.current) {
      const theme = getTheme(themeName);
      terminalRef.current.options.theme = theme;
    }
  }, []);

  const focus = useCallback(() => {
    terminalRef.current?.focus();
  }, []);

  const fit = useCallback(() => {
    fitAddonRef.current?.fit();
  }, []);

  const addToHistory = useCallback((command: string) => {
    if (command.trim()) {
      setHistory(prev => ({
        commands: [...prev.commands, command],
        currentIndex: prev.commands.length + 1,
      }));
    }
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string | null => {
    let newIndex = history.currentIndex;
    
    if (direction === 'up' && newIndex > 0) {
      newIndex--;
    } else if (direction === 'down' && newIndex < history.commands.length) {
      newIndex++;
    } else {
      return null;
    }

    setHistory(prev => ({ ...prev, currentIndex: newIndex }));
    
    if (newIndex === history.commands.length) {
      return '';
    }
    
    return history.commands[newIndex] || null;
  }, [history]);

  const autocomplete = useCallback((partial: string): AutocompleteResult => {
    const commands = getAvailableCommands();
    const matches = commands.filter(cmd => cmd.startsWith(partial));
    
    if (matches.length === 0) {
      return { completions: [], commonPrefix: partial };
    }
    
    // Find common prefix among all matches
    let commonPrefix = matches[0];
    for (let i = 1; i < matches.length; i++) {
      let j = 0;
      while (j < commonPrefix.length && j < matches[i].length && 
             commonPrefix[j] === matches[i][j]) {
        j++;
      }
      commonPrefix = commonPrefix.slice(0, j);
    }
    
    return {
      completions: matches,
      commonPrefix,
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    terminalRef.current?.scrollToBottom();
  }, []);

  const getTerminal = useCallback(() => {
    return terminalRef.current;
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      fitAddonRef.current?.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    terminal: terminalRef.current,
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
    scrollToBottom,
    getTerminal,
  };
}