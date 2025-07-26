// Terminal-related TypeScript interfaces

export interface Command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  handler: (args: string[]) => CommandOutput | Promise<CommandOutput>;
  hidden?: boolean;
}

export interface CommandOutput {
  content: string | React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning' | 'system';
  isHTML?: boolean;
  animate?: boolean;
}

export interface TerminalState {
  history: CommandHistoryEntry[];
  currentDirectory: string;
  suggestions: string[];
  isProcessing: boolean;
}

export interface CommandHistoryEntry {
  id: string;
  command: string;
  output: CommandOutput;
  timestamp: Date;
  directory: string;
}

export interface TerminalConfig {
  prompt?: string;
  welcomeMessage?: string | React.ReactNode;
  maxHistorySize?: number;
  animationSpeed?: number;
  theme?: 'dark' | 'light' | 'matrix';
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileSystemItem>;
  permissions?: string;
}

export interface AutoCompleteMatch {
  command: string;
  score: number;
}