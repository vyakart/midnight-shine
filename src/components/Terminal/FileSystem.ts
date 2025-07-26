import { fileContents, projects, skillCategories, experiences, awards, personalInfo } from '../../data/portfolioContent';
import type { FileSystemItem } from '../../types/terminal';

export interface FileSystemNode extends FileSystemItem {
  children?: Record<string, FileSystemNode>;
  content?: string;
  lastModified?: Date;
  size?: number;
}

// Build project files dynamically
const buildProjectFiles = (): Record<string, FileSystemNode> => {
  const projectFiles: Record<string, FileSystemNode> = {
    'README.md': {
      name: 'README.md',
      type: 'file',
      content: fileContents['projects.md'],
      lastModified: new Date('2024-07-26'),
      size: fileContents['projects.md'].length
    }
  };

  projects.forEach(project => {
    const fileName = `${project.id.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
    projectFiles[fileName] = {
      name: fileName,
      type: 'file',
      content: `# ${project.name}

**Status**: ${project.status}
**Year**: ${project.year}  
**Technologies**: ${project.technologies.join(', ')}

## Description
${project.longDescription}

## Key Highlights
${project.highlights.map(highlight => `• ${highlight}`).join('\n')}

${Object.entries(project.links).length > 0 ? '## Links' : ''}
${Object.entries(project.links).map(([key, url]) => `• [${key.charAt(0).toUpperCase() + key.slice(1)}](${url})`).join('\n')}

---
Generated from portfolio data
`,
      lastModified: new Date('2024-07-26'),
      size: 0
    };
  });

  return projectFiles;
};

// Build skills files dynamically
const buildSkillFiles = (): Record<string, FileSystemNode> => {
  const skillFiles: Record<string, FileSystemNode> = {};

  skillCategories.forEach(category => {
    const fileName = `${category.category.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    skillFiles[fileName] = {
      name: fileName,
      type: 'file',
      content: `${category.icon} ${category.category}

${category.skills.map(skill => `• ${skill}`).join('\n')}

---
Total skills in this category: ${category.skills.length}
`,
      lastModified: new Date('2024-07-26'),
      size: 0
    };
  });

  // Add overview file
  skillFiles['overview.md'] = {
    name: 'overview.md',
    type: 'file',
    content: `# Skills Overview

${skillCategories.map(category => `
## ${category.icon} ${category.category}
${category.skills.map(skill => `• ${skill}`).join('\n')}
`).join('\n')}

---
Total categories: ${skillCategories.length}
Total skills: ${skillCategories.reduce((total, cat) => total + cat.skills.length, 0)}
`,
    lastModified: new Date('2024-07-26'),
    size: 0
  };

  return skillFiles;
};

// Build experience files
const buildExperienceFiles = (): Record<string, FileSystemNode> => {
  const expFiles: Record<string, FileSystemNode> = {
    'overview.txt': {
      name: 'overview.txt',
      type: 'file',
      content: fileContents['experience.txt'],
      lastModified: new Date('2024-07-26'),
      size: fileContents['experience.txt'].length
    }
  };

  experiences.forEach((exp, index) => {
    const fileName = `${(index + 1).toString().padStart(2, '0')}-${exp.organization.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}.md`;
    expFiles[fileName] = {
      name: fileName,
      type: 'file',
      content: `# ${exp.role}
**Organization**: ${exp.organization}
**Period**: ${exp.period}
**Type**: ${exp.type}

## Description
${exp.description}

## Key Achievements
${exp.achievements.map(achievement => `• ${achievement}`).join('\n')}

---
Experience entry ${index + 1} of ${experiences.length}
`,
      lastModified: new Date('2024-07-26'),
      size: 0
    };
  });

  return expFiles;
};

// Virtual file system structure
export const fileSystem: FileSystemNode = {
  name: '/',
  type: 'directory',
  children: {
    'home': {
      name: 'home',
      type: 'directory',
      children: {
        'vyakart': {
          name: 'vyakart',
          type: 'directory',
          children: {
            'README.md': {
              name: 'README.md',
              type: 'file',
              content: fileContents['README.md'],
              lastModified: new Date('2024-07-26'),
              size: fileContents['README.md'].length
            },
            'about.txt': {
              name: 'about.txt',
              type: 'file',
              content: fileContents['about.txt'],
              lastModified: new Date('2024-07-26'),
              size: fileContents['about.txt'].length
            },
            'contact.md': {
              name: 'contact.md',
              type: 'file',
              content: fileContents['contact.md'],
              lastModified: new Date('2024-07-26'),
              size: fileContents['contact.md'].length
            },
            'resume.txt': {
              name: 'resume.txt',
              type: 'file',
              content: fileContents['resume.txt'],
              lastModified: new Date('2024-07-26'),
              size: fileContents['resume.txt'].length
            },
            'principles.md': {
              name: 'principles.md',
              type: 'file',
              content: fileContents['principles.md'],
              lastModified: new Date('2024-07-26'),
              size: fileContents['principles.md'].length
            },
            'languages.txt': {
              name: 'languages.txt',
              type: 'file',
              content: fileContents['languages.txt'],
              lastModified: new Date('2024-07-26'),
              size: fileContents['languages.txt'].length
            },
            'projects': {
              name: 'projects',
              type: 'directory',
              children: buildProjectFiles()
            },
            'skills': {
              name: 'skills',
              type: 'directory',
              children: buildSkillFiles()
            },
            'experience': {
              name: 'experience',
              type: 'directory',
              children: buildExperienceFiles()
            },
            'awards': {
              name: 'awards',
              type: 'directory',
              children: {
                'list.txt': {
                  name: 'list.txt',
                  type: 'file',
                  content: fileContents['awards.txt'],
                  lastModified: new Date('2024-07-26'),
                  size: fileContents['awards.txt'].length
                },
                ...awards.reduce((acc, award, index) => {
                  const fileName = `${(index + 1).toString().padStart(2, '0')}-${award.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
                  acc[fileName] = {
                    name: fileName,
                    type: 'file',
                    content: `${award.title}

Issued by: ${award.issuer}
Date: ${award.date}

${award.description}

---
Award ${index + 1} of ${awards.length}
`,
                    lastModified: new Date(award.date),
                    size: 0
                  };
                  return acc;
                }, {} as Record<string, FileSystemNode>)
              }
            },
            'photos': {
              name: 'photos',
              type: 'directory',
              children: {
                'astrophotography': {
                  name: 'astrophotography',
                  type: 'directory',
                  children: {
                    'README.md': {
                      name: 'README.md',
                      type: 'file',
                      content: `# Astrophotography Collection

A glimpse into my passion for capturing the cosmos. From deep-sky objects to planetary photography, this collection represents hours of patient observation and technical precision.

## Equipment Used
• Telescope: Various setups for different targets
• Camera: DSLR and dedicated astro cameras
• Mount: Equatorial tracking mount for long exposures
• Filters: Light pollution and specialized filters

## Techniques
• Long exposure photography
• Image stacking and processing
• Light pollution mitigation
• Polar alignment and tracking

*Note: This is a portfolio demonstration. Actual photos would be displayed in the web interface.*
`,
                      lastModified: new Date('2024-07-26'),
                      size: 0
                    },
                    'galaxy-m31.txt': {
                      name: 'galaxy-m31.txt',
                      type: 'file',
                      content: `Andromeda Galaxy (M31)
Captured: September 2024
Exposure: 30 x 300s
ISO: 800
Processing: Stacked and processed in PixInsight

The Andromeda Galaxy, our nearest major galactic neighbor, captured on a clear autumn night. This 2.5-hour exposure reveals the galaxy's spiral structure and dust lanes.
`,
                      lastModified: new Date('2024-09-15'),
                      size: 0
                    }
                  }
                },
                'events': {
                  name: 'events',
                  type: 'directory',
                  children: {
                    'eagx-india-2024': {
                      name: 'eagx-india-2024',
                      type: 'directory',
                      children: {
                        'production-highlights.md': {
                          name: 'production-highlights.md',
                          type: 'file',
                          content: `# EAGxIndia 2024 - Production Highlights

## Event Overview
• 300+ attendees
• 3-day conference
• USD 100k budget
• International speakers

## My Role as Production Lead
• AV system design and management
• Safety protocol implementation
• Vendor coordination
• Real-time problem solving
• Design asset creation

## Key Challenges Solved
• Multi-room audio/video distribution
• Last-minute speaker changes
• Weather contingency planning
• Attendee flow management

*Photos from this event showcase the scale and complexity of modern conference production.*
`,
                          lastModified: new Date('2024-08-15'),
                          size: 0
                        }
                      }
                    }
                  }
                },
                'daily': {
                  name: 'daily',
                  type: 'directory',
                  children: {
                    'README.md': {
                      name: 'README.md',
                      type: 'file',
                      content: `# Daily Photography

Capturing moments from everyday life in Bangalore and beyond. Street photography, portraits, and observations of the world around me.

## Themes
• Urban life in Bangalore
• Cultural events and festivals
• Portrait sessions
• Travel photography

*This collection represents my ongoing documentation of life and experiences.*
`,
                      lastModified: new Date('2024-07-26'),
                      size: 0
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Helper functions for file system navigation
export class VirtualFileSystem {
  private currentPath: string = '/home/vyakart';

  getCurrentPath(): string {
    return this.currentPath;
  }

  setCurrentPath(path: string): void {
    this.currentPath = path;
  }

  // Resolve path (handle . and .. and ~)
  resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return path;
    }
    
    if (path === '~') {
      return '/home/vyakart';
    }
    
    if (path.startsWith('~/')) {
      return `/home/vyakart/${path.slice(2)}`;
    }
    
    // Relative path
    const parts = this.currentPath.split('/').filter(p => p);
    const pathParts = path.split('/').filter(p => p);
    
    for (const part of pathParts) {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }
    
    return '/' + parts.join('/');
  }

  // Get directory or file at path
  getItemAtPath(path: string): FileSystemNode | null {
    const resolvedPath = this.resolvePath(path);
    const parts = resolvedPath.split('/').filter(p => p);
    
    let current = fileSystem;
    
    for (const part of parts) {
      if (current.type === 'directory' && current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    
    return current;
  }

  // List directory contents
  listDirectory(path?: string): FileSystemNode[] {
    const targetPath = path || this.currentPath;
    const dir = this.getItemAtPath(targetPath);
    
    if (!dir || dir.type !== 'directory' || !dir.children) {
      return [];
    }
    
    return Object.values(dir.children).sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Read file content
  readFile(path: string): string | null {
    const file = this.getItemAtPath(path);
    
    if (!file || file.type !== 'file') {
      return null;
    }
    
    return file.content || '';
  }

  // Check if path exists
  exists(path: string): boolean {
    return this.getItemAtPath(path) !== null;
  }

  // Check if path is directory
  isDirectory(path: string): boolean {
    const item = this.getItemAtPath(path);
    return item ? item.type === 'directory' : false;
  }

  // Check if path is file
  isFile(path: string): boolean {
    const item = this.getItemAtPath(path);
    return item ? item.type === 'file' : false;
  }

  // Get parent directory
  getParentPath(path?: string): string {
    const targetPath = path || this.currentPath;
    const parts = targetPath.split('/').filter(p => p);
    parts.pop();
    return parts.length === 0 ? '/' : '/' + parts.join('/');
  }

  // Generate tree structure
  generateTree(path?: string, prefix = '', isLast = true): string[] {
    const targetPath = path || this.currentPath;
    const item = this.getItemAtPath(targetPath);
    
    if (!item) {
      return ['Path not found'];
    }
    
    const lines: string[] = [];
    const current = `${prefix}${isLast ? '└── ' : '├── '}${item.name}${item.type === 'directory' ? '/' : ''}`;
    lines.push(current);
    
    if (item.type === 'directory' && item.children) {
      const children = Object.values(item.children).sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
      children.forEach((child, index) => {
        const isLastChild = index === children.length - 1;
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        const childPath = `${targetPath === '/' ? '' : targetPath}/${child.name}`;
        lines.push(...this.generateTree(childPath, newPrefix, isLastChild));
      });
    }
    
    return lines;
  }

  // Find files by pattern
  findFiles(pattern: string, searchPath?: string): string[] {
    const targetPath = searchPath || this.currentPath;
    const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
    const results: string[] = [];
    
    const search = (path: string, item: FileSystemNode) => {
      if (item.type === 'file' && regex.test(item.name)) {
        results.push(path);
      }
      
      if (item.type === 'directory' && item.children) {
        Object.entries(item.children).forEach(([name, child]) => {
          search(`${path}/${name}`, child);
        });
      }
    };
    
    const startItem = this.getItemAtPath(targetPath);
    if (startItem) {
      search(targetPath, startItem);
    }
    
    return results;
  }
}

// Export singleton instance
export const vfs = new VirtualFileSystem();