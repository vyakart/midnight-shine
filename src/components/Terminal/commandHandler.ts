import type { Command, CommandOutput } from '../../types/terminal';
import { vfs } from './FileSystem';
import {
  personalInfo,
  projects,
  skillCategories,
  experiences,
  socialLinks,
  awards
} from '../../data/portfolioContent';

// Matrix command types and interfaces
interface MatrixParsedArgs {
  mode: 'classic' | 'digital' | 'code' | 'neo' | 'stop';
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  showHelp: boolean;
  error?: string;
}

// Matrix command parser
const parseMatrixCommand = (args: string[]): MatrixParsedArgs => {
  const result: MatrixParsedArgs = {
    mode: 'classic',
    duration: 5000,
    intensity: 'medium',
    showHelp: false,
  };

  if (args.length === 0) {
    return result;
  }

  // Check for help request
  if (args.includes('--help') || args.includes('-h')) {
    result.showHelp = true;
    return result;
  }

  // Parse mode
  const modeArg = args.find(arg => !arg.startsWith('--'));
  if (modeArg) {
    const validModes = ['classic', 'digital', 'code', 'neo', 'stop'];
    if (validModes.includes(modeArg)) {
      result.mode = modeArg as MatrixParsedArgs['mode'];
    } else {
      result.error = `Invalid mode: ${modeArg}. Valid modes: ${validModes.join(', ')}`;
      return result;
    }
  }

  // Parse duration parameter
  const durationArg = args.find(arg => arg.startsWith('--duration='));
  if (durationArg) {
    const duration = parseInt(durationArg.split('=')[1]);
    if (isNaN(duration) || duration < 1000 || duration > 30000) {
      result.error = 'Duration must be between 1000ms and 30000ms';
      return result;
    }
    result.duration = duration;
  }

  // Parse intensity parameter
  const intensityArg = args.find(arg => arg.startsWith('--intensity='));
  if (intensityArg) {
    const intensity = intensityArg.split('=')[1];
    const validIntensities = ['low', 'medium', 'high'];
    if (validIntensities.includes(intensity)) {
      result.intensity = intensity as MatrixParsedArgs['intensity'];
    } else {
      result.error = `Invalid intensity: ${intensity}. Valid intensities: ${validIntensities.join(', ')}`;
      return result;
    }
  }

  return result;
};

// Matrix help text generator
const getMatrixHelpText = (): string => {
  return `
<div class="font-mono text-green-400">
<div class="text-cyan-400 font-bold mb-2">🕶️ MATRIX COMMAND REFERENCE</div>

<div class="mb-3">
  <span class="text-yellow-400">USAGE:</span>
  <div class="ml-4 text-gray-300">matrix [mode] [--duration=&lt;ms&gt;] [--intensity=&lt;level&gt;]</div>
</div>

<div class="mb-3">
  <span class="text-yellow-400">MODES:</span>
  <div class="ml-4">
    <div><span class="text-green-300">classic</span>  - Traditional green rain effect</div>
    <div><span class="text-blue-300">digital</span>  - Binary code rain with glitch effects</div>
    <div><span class="text-purple-300">code</span>    - Programming language snippets</div>
    <div><span class="text-red-300">neo</span>     - Movie-style with special messages</div>
    <div><span class="text-gray-300">stop</span>    - Exit matrix mode</div>
  </div>
</div>

<div class="mb-3">
  <span class="text-yellow-400">PARAMETERS:</span>
  <div class="ml-4">
    <div><span class="text-cyan-300">--duration=&lt;ms&gt;</span> - Effect duration (1000-30000ms)</div>
    <div><span class="text-cyan-300">--intensity=&lt;level&gt;</span> - Effect intensity (low|medium|high)</div>
  </div>
</div>

<div class="mb-3">
  <span class="text-yellow-400">EXAMPLES:</span>
  <div class="ml-4 text-gray-300">
    <div>matrix</div>
    <div>matrix neo --duration=10000 --intensity=high</div>
    <div>matrix digital --intensity=low</div>
    <div>matrix stop</div>
  </div>
</div>

<div class="text-red-400 text-sm">Warning: High intensity effects may cause visual discomfort</div>
</div>
  `.trim();
};

// Matrix character sets for different modes
const getMatrixCharacterSet = (mode: MatrixParsedArgs['mode']): string => {
  const characterSets = {
    classic: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン',
    digital: '01010101010101010101010101010101010101010101010101010101010101010101010101010101',
    code: 'const let var function class if else for while return try catch async await import export',
    neo: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲンREDPILLBLUEPILL',
    stop: '',
  };
  
  return characterSets[mode] || characterSets.classic;
};

// Matrix messages for different modes
const getMatrixMessages = (mode: MatrixParsedArgs['mode']): string[] => {
  const messages = {
    classic: [
      'Wake up, Neo...',
      'The Matrix has you...',
      'Follow the white rabbit',
      'There is no spoon',
      'Free your mind',
    ],
    digital: [
      'SYSTEM BREACH DETECTED',
      'FIREWALL COMPROMISED',
      'ACCESSING MAINFRAME...',
      'DECRYPTING DATA...',
      'NEURAL LINK ESTABLISHED',
    ],
    code: [
      'const reality = new Simulation();',
      'if (redPill) { awaken(); }',
      'while(true) { question_everything(); }',
      'try { escape_matrix(); } catch { accept_fate(); }',
      'function chooseYourPath() { return freedom || comfort; }',
    ],
    neo: [
      'Mr. Anderson...',
      'You are The One',
      'I know Kung Fu',
      'There is a difference between knowing the path and walking the path',
      'What is real? How do you define real?',
      'Welcome to the real world',
      'The Matrix is everywhere. It is all around us.',
    ],
    stop: [],
  };

  return messages[mode] || messages.classic;
};

// Portfolio content reveals for matrix mode
const getMatrixContentReveals = (mode: MatrixParsedArgs['mode']): Record<string, any> => {
  const baseReveals = {
    skills: skillCategories.map(cat => cat.category).join(' • '),
    projects: projects.length.toString() + ' active projects',
    location: personalInfo.location,
    contact: personalInfo.email,
  };

  const modeSpecificReveals = {
    classic: {
      ...baseReveals,
      message: 'The portfolio reveals itself...',
    },
    digital: {
      ...baseReveals,
      binary: '01010110 01111001 01100001 01101011 01100001 01110010 01110100', // "Vyakart" in binary
      message: 'Data streams converging...',
    },
    code: {
      ...baseReveals,
      codeSnippet: 'const vyakart = new Developer({ curious: true, generalist: true });',
      message: 'Compiling experience...',
    },
    neo: {
      ...baseReveals,
      philosophy: personalInfo.tagline,
      revelation: 'The bridge between ideas and impact',
      message: 'The truth reveals itself...',
    },
    stop: {},
  };

  return modeSpecificReveals[mode] || modeSpecificReveals.classic;
};

// Command implementations
const commands: Record<string, Command> = {
  help: {
    name: 'help',
    description: 'Display available commands',
    usage: 'help [command]',
    handler: (args: string[]): CommandOutput => {
      if (args.length > 0 && commands[args[0]]) {
        const cmd = commands[args[0]];
        return {
          content: `
${cmd.name} - ${cmd.description}
${cmd.usage ? `Usage: ${cmd.usage}` : ''}
${cmd.aliases ? `Aliases: ${cmd.aliases.join(', ')}` : ''}
          `.trim(),
          type: 'info',
        };
      }
      
      const commandList = Object.values(commands)
        .filter(cmd => !cmd.hidden)
        .map(cmd => `  ${cmd.name.padEnd(15)} ${cmd.description}`)
        .join('\n');
      
      return {
        content: `Available commands:\n\n${commandList}\n\nType 'help <command>' for more information about a specific command.`,
        type: 'info',
      };
    },
  },
  
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    aliases: ['cls'],
    handler: (): CommandOutput => {
      return {
        content: 'CLEAR_TERMINAL',
        type: 'system',
      };
    },
  },
  
  whoami: {
    name: 'whoami',
    description: 'Display information about the portfolio owner',
    handler: (): CommandOutput => {
      return {
        content: `${personalInfo.name} (${personalInfo.alias})

${personalInfo.title}
📍 ${personalInfo.location}
📧 ${personalInfo.email}

${personalInfo.tagline}

Languages: ${personalInfo.languages.join(', ')}

"${personalInfo.bio.split('\n')[1].trim()}"`,
        type: 'success',
      };
    },
  },
  
  ls: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [directory] [-l for detailed view]',
    aliases: ['ll', 'dir'],
    handler: (args: string[]): CommandOutput => {
      const isDetailed = args.includes('-l');
      const pathArg = args.find(arg => !arg.startsWith('-')) || vfs.getCurrentPath();
      
      const items = vfs.listDirectory(pathArg);
      
      if (items.length === 0) {
        const targetExists = vfs.exists(pathArg);
        if (!targetExists) {
          return {
            content: `ls: cannot access '${pathArg}': No such file or directory`,
            type: 'error',
          };
        }
        return {
          content: '',
          type: 'info',
        };
      }
      
      if (isDetailed) {
        const detailedItems = items.map(item => {
          const perms = item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = item.size ? item.size.toString().padStart(8) : '     n/a';
          const date = item.lastModified ? item.lastModified.toLocaleDateString() : '2024-07-26';
          const icon = item.type === 'directory' ? '📁' : '📄';
          return `${perms} 1 vyakart users ${size} ${date} <span class="${item.type === 'directory' ? 'text-blue-400' : 'text-gray-300'}">${icon} ${item.name}</span>`;
        }).join('\n');
        
        return {
          content: detailedItems,
          type: 'info',
          isHTML: true,
        };
      }
      
      const simpleItems = items
        .map(item => {
          const icon = item.type === 'directory' ? '📁' : '📄';
          const color = item.type === 'directory' ? 'text-blue-400' : 'text-gray-300';
          return `<span class="${color}">${icon} ${item.name}</span>`;
        })
        .join('  ');
      
      return {
        content: simpleItems,
        type: 'info',
        isHTML: true,
      };
    },
  },
  
  cd: {
    name: 'cd',
    description: 'Change directory',
    usage: 'cd <directory>',
    handler: (args: string[]): CommandOutput => {
      let targetPath = args[0];
      
      if (!targetPath) {
        targetPath = '/home/vyakart';
      }
      
      const resolvedPath = vfs.resolvePath(targetPath);
      
      if (!vfs.exists(resolvedPath)) {
        return {
          content: `cd: ${targetPath}: No such file or directory`,
          type: 'error',
        };
      }
      
      if (!vfs.isDirectory(resolvedPath)) {
        return {
          content: `cd: ${targetPath}: Not a directory`,
          type: 'error',
        };
      }
      
      vfs.setCurrentPath(resolvedPath);
      return {
        content: `CHANGE_DIRECTORY:${resolvedPath}`,
        type: 'system',
      };
    },
  },
  
  cat: {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <file> [file2] [file3]...',
    handler: (args: string[]): CommandOutput => {
      if (args.length === 0) {
        return {
          content: 'cat: missing file operand',
          type: 'error',
        };
      }
      
      const results: string[] = [];
      
      for (const filename of args) {
        const resolvedPath = vfs.resolvePath(filename);
        
        if (!vfs.exists(resolvedPath)) {
          results.push(`cat: ${filename}: No such file or directory`);
          continue;
        }
        
        if (vfs.isDirectory(resolvedPath)) {
          results.push(`cat: ${filename}: Is a directory`);
          continue;
        }
        
        const content = vfs.readFile(resolvedPath);
        if (content !== null) {
          if (args.length > 1) {
            results.push(`==> ${filename} <==`);
          }
          results.push(content);
          if (args.length > 1) {
            results.push('');
          }
        } else {
          results.push(`cat: ${filename}: Permission denied`);
        }
      }
      
      return {
        content: results.join('\n'),
        type: 'info',
        animate: true,
      };
    },
  },
  
  echo: {
    name: 'echo',
    description: 'Display a line of text',
    usage: 'echo <text>',
    handler: (args: string[]): CommandOutput => {
      return {
        content: args.join(' '),
        type: 'info',
      };
    },
  },
  
  // Navigation commands
  home: {
    name: 'home',
    description: 'Navigate to home page',
    handler: (): CommandOutput => {
      return {
        content: 'NAVIGATE:/',
        type: 'system',
      };
    },
  },
  
  about: {
    name: 'about',
    description: 'Navigate to about page',
    handler: (): CommandOutput => {
      return {
        content: 'NAVIGATE:/about',
        type: 'system',
      };
    },
  },
  
  contact: {
    name: 'contact',
    description: 'Navigate to contact page',
    handler: (): CommandOutput => {
      return {
        content: 'NAVIGATE:/contact',
        type: 'system',
      };
    },
  },
  
  skills: {
    name: 'skills',
    description: 'Display skills and technologies',
    handler: (): CommandOutput => {
      const output = skillCategories
        .map(category => `${category.icon} ${category.category}\n${category.skills.map(skill => `  • ${skill}`).join('\n')}`)
        .join('\n\n');
      
      return {
        content: output,
        type: 'info',
        animate: true,
      };
    },
  },

  projects: {
    name: 'projects',
    description: 'Display projects portfolio',
    usage: 'projects [project-id]',
    handler: (args: string[]): CommandOutput => {
      if (args.length > 0) {
        const projectId = args[0];
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
          return {
            content: `Project '${projectId}' not found. Use 'projects' to see all projects.`,
            type: 'error',
          };
        }
        
        const links = Object.entries(project.links)
          .map(([key, url]) => `  • ${key}: ${url}`)
          .join('\n');
        
        return {
          content: `# ${project.name} (${project.year})

**Status**: ${project.status}
**Technologies**: ${project.technologies.join(', ')}

## Description
${project.longDescription}

## Key Highlights
${project.highlights.map(highlight => `• ${highlight}`).join('\n')}

${links ? '## Links\n' + links : ''}`,
          type: 'info',
          animate: true,
        };
      }
      
      const projectList = projects.map(project => {
        const statusIcon = project.status === 'completed' ? '✅' :
                          project.status === 'in-progress' ? '🚧' : '💡';
        return `${statusIcon} ${project.name} (${project.year}) - ${project.description}`;
      }).join('\n');
      
      return {
        content: `Projects Portfolio\n\n${projectList}\n\nUse 'projects <id>' for details:\n${projects.map(p => `• ${p.id}`).join('\n')}`,
        type: 'info',
        animate: true,
      };
    },
  },

  experience: {
    name: 'experience',
    description: 'Display work experience',
    aliases: ['exp', 'work'],
    handler: (): CommandOutput => {
      const expList = experiences.map(exp => {
        const typeIcon = exp.type === 'work' ? '💼' : exp.type === 'volunteer' ? '🤝' : '🚀';
        return `${typeIcon} ${exp.role} - ${exp.organization} (${exp.period})
   ${exp.description}`;
      }).join('\n\n');
      
      return {
        content: `Professional Experience\n\n${expList}`,
        type: 'info',
        animate: true,
      };
    },
  },

  resume: {
    name: 'resume',
    description: 'Display resume summary',
    aliases: ['cv'],
    handler: (): CommandOutput => {
      return {
        content: vfs.readFile('/home/vyakart/resume.txt') || 'Resume not found',
        type: 'info',
        animate: true,
      };
    },
  },

  awards: {
    name: 'awards',
    description: 'Display awards and recognition',
    handler: (): CommandOutput => {
      if (awards.length === 0) {
        return {
          content: 'No awards data available.',
          type: 'info',
        };
      }
      
      const awardsList = awards.map(award =>
        `🏆 ${award.title}\n   Issued by: ${award.issuer} (${award.date})\n   ${award.description}`
      ).join('\n\n');
      
      return {
        content: `Awards & Recognition\n\n${awardsList}`,
        type: 'info',
        animate: true,
      };
    },
  },
  
  // Special commands
  theme: {
    name: 'theme',
    description: 'Toggle dark/light theme',
    usage: 'theme [dark|light|matrix]',
    handler: (args: string[]): CommandOutput => {
      const theme = args[0];
      
      if (theme && !['dark', 'light', 'matrix'].includes(theme)) {
        return {
          content: `Invalid theme: ${theme}. Available themes: dark, light, matrix`,
          type: 'error',
        };
      }
      
      return {
        content: `THEME:${theme || 'toggle'}`,
        type: 'system',
      };
    },
  },
  
  matrix: {
    name: 'matrix',
    description: 'Enter the Matrix with enhanced effects and modes',
    usage: 'matrix [mode] [--duration=<ms>] [--intensity=<level>]',
    aliases: ['neo'],
    hidden: false,
    handler: (args: string[]): CommandOutput => {
      // Parse command arguments
      const parsedArgs = parseMatrixCommand(args);
      
      if (parsedArgs.error) {
        return {
          content: parsedArgs.error,
          type: 'error',
        };
      }

      if (parsedArgs.showHelp) {
        return {
          content: getMatrixHelpText(),
          type: 'info',
          isHTML: true,
        };
      }

      if (parsedArgs.mode === 'stop') {
        return {
          content: 'MATRIX:stop',
          type: 'system',
        };
      }

      // Return structured matrix configuration
      const matrixConfig = {
        mode: parsedArgs.mode,
        duration: parsedArgs.duration,
        intensity: parsedArgs.intensity,
        characterSet: getMatrixCharacterSet(parsedArgs.mode),
        messages: getMatrixMessages(parsedArgs.mode),
        contentReveals: getMatrixContentReveals(parsedArgs.mode),
        sounds: true,
        effects: {
          glitchText: true,
          scanLines: true,
          bootSequence: parsedArgs.mode === 'neo',
          particleField: parsedArgs.intensity === 'high',
          fullScreen: true,
          matrixRain: true,
        },
        transitions: {
          entryEffect: parsedArgs.mode === 'neo' ? 'bootSequence' : 'fadeIn',
          exitEffect: 'glitchOut',
          messageRevealDelay: parsedArgs.mode === 'code' ? 2000 : 1500,
          fadeInDuration: 1000,
          fadeOutDuration: 800,
        },
        audio: {
          matrixSound: true,
          ambientHum: parsedArgs.intensity !== 'low',
          glitchSounds: parsedArgs.mode === 'digital',
          bootSounds: parsedArgs.mode === 'neo',
          volumeLevel: parsedArgs.intensity === 'high' ? 0.8 : parsedArgs.intensity === 'medium' ? 0.6 : 0.4,
        },
        theme: {
          primaryColor: parsedArgs.mode === 'neo' ? '#ff0000' : parsedArgs.mode === 'digital' ? '#00ffff' : parsedArgs.mode === 'code' ? '#ff00ff' : '#00ff00',
          backgroundColor: '#000000',
          trailOpacity: parsedArgs.intensity === 'high' ? 0.8 : parsedArgs.intensity === 'medium' ? 0.6 : 0.4,
        }
      };

      // Provide user feedback
      const feedbackMessages = {
        classic: 'Entering the Matrix... 🕶️',
        digital: 'Initiating digital rain sequence... 💾',
        code: 'Compiling reality... 💻',
        neo: 'Welcome to the real world... 🔴',
        stop: 'Exiting the Matrix...'
      };

      return {
        content: `${feedbackMessages[parsedArgs.mode]}\n\nMATRIX:${JSON.stringify(matrixConfig)}`,
        type: 'system',
      };
    },
  },
  
  socials: {
    name: 'socials',
    description: 'Display social media links',
    aliases: ['contact', 'links'],
    handler: (): CommandOutput => {
      const links = socialLinks
        .map(social => `${social.icon} <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${social.platform}</a> - ${social.username}`)
        .join('\n');
      
      return {
        content: `Connect with me:\n\n${links}`,
        type: 'info',
        isHTML: true,
      };
    },
  },

  pwd: {
    name: 'pwd',
    description: 'Print working directory',
    handler: (): CommandOutput => {
      return {
        content: vfs.getCurrentPath(),
        type: 'info',
      };
    },
  },

  tree: {
    name: 'tree',
    description: 'Display directory tree structure',
    usage: 'tree [directory]',
    handler: (args: string[]): CommandOutput => {
      const targetPath = args[0] || vfs.getCurrentPath();
      
      if (!vfs.exists(targetPath)) {
        return {
          content: `tree: ${targetPath}: No such file or directory`,
          type: 'error',
        };
      }
      
      const treeLines = vfs.generateTree(targetPath);
      return {
        content: treeLines.join('\n'),
        type: 'info',
      };
    },
  },

  find: {
    name: 'find',
    description: 'Find files by name pattern',
    usage: 'find <pattern> [directory]',
    handler: (args: string[]): CommandOutput => {
      if (args.length === 0) {
        return {
          content: 'find: missing pattern',
          type: 'error',
        };
      }
      
      const pattern = args[0];
      const searchPath = args[1] || vfs.getCurrentPath();
      
      const results = vfs.findFiles(pattern, searchPath);
      
      if (results.length === 0) {
        return {
          content: `No files matching '${pattern}' found in ${searchPath}`,
          type: 'info',
        };
      }
      
      return {
        content: results.join('\n'),
        type: 'info',
      };
    },
  },

  wc: {
    name: 'wc',
    description: 'Word, line, character, and byte count',
    usage: 'wc [-l|-w|-c] <file>',
    handler: (args: string[]): CommandOutput => {
      if (args.length === 0) {
        return {
          content: 'wc: missing file operand',
          type: 'error',
        };
      }
      
      const flags = args.filter(arg => arg.startsWith('-'));
      const files = args.filter(arg => !arg.startsWith('-'));
      
      const results: string[] = [];
      
      for (const filename of files) {
        const content = vfs.readFile(filename);
        
        if (content === null) {
          results.push(`wc: ${filename}: No such file or directory`);
          continue;
        }
        
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(w => w).length;
        const chars = content.length;
        
        if (flags.includes('-l')) {
          results.push(`${lines} ${filename}`);
        } else if (flags.includes('-w')) {
          results.push(`${words} ${filename}`);
        } else if (flags.includes('-c')) {
          results.push(`${chars} ${filename}`);
        } else {
          results.push(`${lines} ${words} ${chars} ${filename}`);
        }
      }
      
      return {
        content: results.join('\n'),
        type: 'info',
      };
    },
  },
  
  // Easter eggs
  sudo: {
    name: 'sudo',
    description: 'Run command with superuser privileges',
    hidden: true,
    handler: (args: string[]): CommandOutput => {
      if (args.join(' ') === 'rm -rf /') {
        return {
          content: '🚨 Nice try! But this is just a portfolio, not a real terminal. 😄',
          type: 'warning',
        };
      }
      
      return {
        content: 'sudo: permission denied. This incident will be reported to Santa. 🎅',
        type: 'error',
      };
    },
  },
  
  exit: {
    name: 'exit',
    description: 'Exit the terminal',
    aliases: ['quit', 'bye'],
    handler: (): CommandOutput => {
      return {
        content: "You can't escape! This is your new home now. 😈\n\nJust kidding! Thanks for visiting! 👋",
        type: 'info',
      };
    },
  },
};

// Export command handler function
export const handleCommand = async (
  input: string,
  currentDirectory: string = '/'
): Promise<CommandOutput> => {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return { content: '', type: 'info' };
  }
  
  const [commandName, ...args] = trimmedInput.split(' ');
  const command = commands[commandName.toLowerCase()];
  
  if (!command) {
    // Check aliases
    const aliasedCommand = Object.values(commands).find(cmd =>
      cmd.aliases?.includes(commandName.toLowerCase())
    );
    
    if (aliasedCommand) {
      return await aliasedCommand.handler(args);
    }
    
    return {
      content: `Command not found: ${commandName}. Type 'help' for available commands.`,
      type: 'error',
    };
  }
  
  return await command.handler(args);
};

// Export function to get command suggestions
export const getCommandSuggestions = (input: string): string[] => {
  if (!input) return [];
  
  const lowerInput = input.toLowerCase();
  const suggestions: string[] = [];
  
  // Add command suggestions
  Object.values(commands).forEach(cmd => {
    if (!cmd.hidden && cmd.name.toLowerCase().startsWith(lowerInput)) {
      suggestions.push(cmd.name);
    }
    
    // Check aliases
    cmd.aliases?.forEach(alias => {
      if (alias.toLowerCase().startsWith(lowerInput)) {
        suggestions.push(alias);
      }
    });
  });
  
  return suggestions.sort();
};

// Export available commands for autocomplete
export const availableCommands = Object.keys(commands).filter(
  cmd => !commands[cmd].hidden
);