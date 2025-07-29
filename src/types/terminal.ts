import { Terminal } from '@xterm/xterm';

export interface TerminalTheme {
  name: string;
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Map<string, FileNode>;
  permissions?: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface FileSystem {
  root: FileNode;
  currentPath: string[];
}

export interface CommandHandler {
  execute: (args: string[], terminal: Terminal, filesystem: FileSystem) => Promise<void> | void;
  description: string;
}

export interface TerminalAPI {
  send: (text: string) => void;
  clear: () => void;
  setTheme: (themeName: string) => void;
}

export interface TerminalConfig {
  theme: 'dark' | 'light' | 'retro';
  fontSize: number;
  fontFamily: string;
  rows: number;
  cols: number;
  cursorBlink: boolean;
  cursorStyle: 'block' | 'underline' | 'bar';
  soundEnabled: boolean;
}

export interface CommandHistory {
  commands: string[];
  currentIndex: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AutocompleteResult {
  completions: string[];
  commonPrefix: string;
}