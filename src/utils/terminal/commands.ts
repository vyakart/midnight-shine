import type { CommandHandler, FileSystem } from '../../types/terminal';
import type { Terminal } from '@xterm/xterm';
import {
  getCurrentDirectory,
  navigateToPath,
  resolvePath,
  getAbsolutePath,
  createFile,
  createDirectory,
  deleteNode,
  writeFile,
  readFile,
} from './filesystem';

const commands: Record<string, CommandHandler> = {
  help: {
    description: 'Display this help message',
    execute: async (args, terminal) => {
      terminal.writeln('\r\n\x1b[1;36mNishiOS Terminal Commands:\x1b[0m\r\n');
      
      const commandList = [
        ['help', 'Display this help message'],
        ['ls', 'List directory contents'],
        ['cd', 'Change directory'],
        ['pwd', 'Print working directory'],
        ['cat', 'Display file contents'],
        ['touch', 'Create an empty file'],
        ['mkdir', 'Create a directory'],
        ['rm', 'Remove file or directory'],
        ['echo', 'Display text or write to file'],
        ['edit', 'Edit a file (simple editor)'],
        ['vim', 'Edit a file (vim-like editor)'],
        ['clear', 'Clear the terminal screen'],
        ['play', 'Play audio file'],
        ['open', 'Open URL in browser'],
        ['theme', 'Change terminal theme (dark/light/retro)'],
        ['exit', 'Exit the terminal'],
        ['nishito <query>', 'Chat with AI assistant'],
      ];
      
      commandList.forEach(([cmd, desc]) => {
        terminal.writeln(`  \x1b[1;32m${cmd.padEnd(20)}\x1b[0m ${desc}`);
      });
      
      terminal.writeln('\r\n\x1b[1;33mTips:\x1b[0m');
      terminal.writeln('  • Use ↑/↓ arrows for command history');
      terminal.writeln('  • Use TAB for auto-completion');
      terminal.writeln('  • Prefix any message with "nishito " to chat with AI');
      terminal.writeln('');
    },
  },
  
  ls: {
    description: 'List directory contents',
    execute: async (args, terminal, filesystem) => {
      const showHidden = args.includes('-a');
      const longFormat = args.includes('-l');
      
      const currentDir = getCurrentDirectory(filesystem);
      if (!currentDir || currentDir.type !== 'directory') {
        terminal.writeln('\x1b[1;31mError: Not in a directory\x1b[0m');
        return;
      }
      
      const entries = Array.from(currentDir.children!.entries());
      
      if (longFormat) {
        terminal.writeln('total ' + entries.length);
        entries.forEach(([name, node]) => {
          const date = node.modifiedAt.toLocaleDateString();
          const time = node.modifiedAt.toLocaleTimeString();
          const size = node.type === 'file' ? (node.content?.length || 0) : '-';
          const color = node.type === 'directory' ? '\x1b[1;34m' : '\x1b[0m';
          
          terminal.writeln(
            `${node.permissions} ${size.toString().padStart(8)} ${date} ${time} ${color}${name}\x1b[0m`
          );
        });
      } else {
        entries.forEach(([name, node]) => {
          const color = node.type === 'directory' ? '\x1b[1;34m' : '\x1b[0m';
          terminal.write(`${color}${name}\x1b[0m  `);
        });
        if (entries.length > 0) terminal.writeln('');
      }
    },
  },
  
  cd: {
    description: 'Change directory',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0 || args[0] === '~') {
        filesystem.currentPath = ['home', 'user'];
        return;
      }
      
      const targetPath = resolvePath(filesystem.currentPath, args[0]);
      const targetDir = navigateToPath(filesystem, targetPath);
      
      if (!targetDir) {
        terminal.writeln(`\x1b[1;31mcd: ${args[0]}: No such file or directory\x1b[0m`);
        return;
      }
      
      if (targetDir.type !== 'directory') {
        terminal.writeln(`\x1b[1;31mcd: ${args[0]}: Not a directory\x1b[0m`);
        return;
      }
      
      filesystem.currentPath = targetPath;
    },
  },
  
  pwd: {
    description: 'Print working directory',
    execute: async (args, terminal, filesystem) => {
      terminal.writeln(getAbsolutePath(filesystem.currentPath));
    },
  },
  
  cat: {
    description: 'Display file contents',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mcat: missing operand\x1b[0m');
        return;
      }
      
      for (const filename of args) {
        const path = resolvePath(filesystem.currentPath, filename);
        const content = readFile(filesystem, getAbsolutePath(path));
        
        if (content === null) {
          terminal.writeln(`\x1b[1;31mcat: ${filename}: No such file or directory\x1b[0m`);
          continue;
        }
        
        terminal.writeln(content);
      }
    },
  },
  
  touch: {
    description: 'Create an empty file',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mtouch: missing file operand\x1b[0m');
        return;
      }
      
      for (const filename of args) {
        const path = resolvePath(filesystem.currentPath, filename);
        const success = createFile(filesystem, getAbsolutePath(path));
        
        if (!success) {
          terminal.writeln(`\x1b[1;31mtouch: cannot create '${filename}'\x1b[0m`);
        }
      }
    },
  },
  
  mkdir: {
    description: 'Create a directory',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mmkdir: missing operand\x1b[0m');
        return;
      }
      
      for (const dirname of args) {
        const path = resolvePath(filesystem.currentPath, dirname);
        const success = createDirectory(filesystem, getAbsolutePath(path));
        
        if (!success) {
          terminal.writeln(`\x1b[1;31mmkdir: cannot create directory '${dirname}'\x1b[0m`);
        }
      }
    },
  },
  
  rm: {
    description: 'Remove file or directory',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mrm: missing operand\x1b[0m');
        return;
      }
      
      const force = args.includes('-f');
      const recursive = args.includes('-r') || args.includes('-rf');
      const filenames = args.filter(arg => !arg.startsWith('-'));
      
      for (const filename of filenames) {
        const path = resolvePath(filesystem.currentPath, filename);
        const node = navigateToPath(filesystem, path);
        
        if (!node && !force) {
          terminal.writeln(`\x1b[1;31mrm: cannot remove '${filename}': No such file or directory\x1b[0m`);
          continue;
        }
        
        if (node?.type === 'directory' && !recursive) {
          terminal.writeln(`\x1b[1;31mrm: cannot remove '${filename}': Is a directory\x1b[0m`);
          continue;
        }
        
        if (node) {
          deleteNode(filesystem, getAbsolutePath(path));
        }
      }
    },
  },
  
  echo: {
    description: 'Display text or write to file',
    execute: async (args, terminal, filesystem) => {
      const text = args.join(' ');
      const redirectIndex = args.indexOf('>');
      const appendIndex = args.indexOf('>>');
      
      if (redirectIndex > -1 && args[redirectIndex + 1]) {
        const content = args.slice(0, redirectIndex).join(' ');
        const filename = args[redirectIndex + 1];
        const path = resolvePath(filesystem.currentPath, filename);
        const absolutePath = getAbsolutePath(path);
        
        if (!createFile(filesystem, absolutePath, content)) {
          writeFile(filesystem, absolutePath, content);
        }
      } else if (appendIndex > -1 && args[appendIndex + 1]) {
        const content = args.slice(0, appendIndex).join(' ');
        const filename = args[appendIndex + 1];
        const path = resolvePath(filesystem.currentPath, filename);
        const absolutePath = getAbsolutePath(path);
        
        const existing = readFile(filesystem, absolutePath) || '';
        writeFile(filesystem, absolutePath, existing + '\n' + content);
      } else {
        terminal.writeln(text);
      }
    },
  },
  
  edit: {
    description: 'Edit a file (simple editor)',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31medit: missing file operand\x1b[0m');
        return;
      }
      
      const filename = args[0];
      const path = resolvePath(filesystem.currentPath, filename);
      const absolutePath = getAbsolutePath(path);
      
      let content = readFile(filesystem, absolutePath) || '';
      const lines = content.split('\n');
      
      terminal.writeln('\x1b[1;36m--- Simple Editor ---\x1b[0m');
      terminal.writeln('Commands: :w (save), :q (quit), :wq (save and quit)');
      terminal.writeln('');
      
      // Display current content with line numbers
      lines.forEach((line, i) => {
        terminal.writeln(`${(i + 1).toString().padStart(3)} | ${line}`);
      });
      
      terminal.writeln('\x1b[1;33m--- End of file ---\x1b[0m');
      terminal.writeln('(Editor mode not fully implemented in this demo)');
      
      // In a real implementation, this would enter an interactive editing mode
      createFile(filesystem, absolutePath, content);
    },
  },
  
  vim: {
    description: 'Edit a file (vim-like editor)',
    execute: async (args, terminal, filesystem) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mvim: missing file operand\x1b[0m');
        return;
      }
      
      terminal.writeln('\x1b[1;36m--- VIM Mode ---\x1b[0m');
      terminal.writeln('(VIM emulation not fully implemented in this demo)');
      terminal.writeln('Press ESC then :q to quit');
    },
  },
  
  clear: {
    description: 'Clear the terminal screen',
    execute: async (args, terminal) => {
      terminal.clear();
    },
  },
  
  play: {
    description: 'Play audio file',
    execute: async (args, terminal) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mplay: missing file operand\x1b[0m');
        return;
      }
      
      terminal.writeln(`\x1b[1;36m♪ Playing: ${args[0]} ♪\x1b[0m`);
      terminal.writeln('(Audio playback not implemented in this demo)');
    },
  },
  
  open: {
    description: 'Open URL in browser',
    execute: async (args, terminal) => {
      if (args.length === 0) {
        terminal.writeln('\x1b[1;31mopen: missing URL\x1b[0m');
        return;
      }
      
      const url = args[0];
      terminal.writeln(`\x1b[1;36mOpening ${url} in browser...\x1b[0m`);
      window.open(url, '_blank');
    },
  },
  
  theme: {
    description: 'Change terminal theme',
    execute: async (args, terminal) => {
      if (args.length === 0) {
        terminal.writeln('Available themes: dark, light, retro');
        return;
      }
      
      const theme = args[0];
      if (!['dark', 'light', 'retro'].includes(theme)) {
        terminal.writeln(`\x1b[1;31mUnknown theme: ${theme}\x1b[0m`);
        return;
      }
      
      // Theme change will be handled by the terminal component
      terminal.writeln(`\x1b[1;32mTheme changed to: ${theme}\x1b[0m`);
    },
  },
  
  exit: {
    description: 'Exit the terminal',
    execute: async (args, terminal) => {
      terminal.writeln('\x1b[1;33mGoodbye! 👋\x1b[0m');
      // The actual exit handling will be done by the component
    },
  },
};

export default commands;

export function executeCommand(
  command: string,
  args: string[],
  terminal: Terminal,
  filesystem: FileSystem
): Promise<void> | void {
  const handler = commands[command];
  
  if (!handler) {
    terminal.writeln(`\x1b[1;31mCommand not found: ${command}\x1b[0m`);
    terminal.writeln(`Type 'help' for available commands`);
    return;
  }
  
  return handler.execute(args, terminal, filesystem);
}

export function getAvailableCommands(): string[] {
  return Object.keys(commands);
}

export function getCommandDescription(command: string): string | undefined {
  return commands[command]?.description;
}