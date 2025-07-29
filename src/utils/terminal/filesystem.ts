import type { FileNode, FileSystem } from '../../types/terminal';

const FILESYSTEM_STORAGE_KEY = 'nishitos-filesystem';

export function createFileNode(
  name: string,
  type: 'file' | 'directory',
  content?: string
): FileNode {
  const now = new Date();
  return {
    name,
    type,
    content: type === 'file' ? content || '' : undefined,
    children: type === 'directory' ? new Map() : undefined,
    permissions: type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--',
    createdAt: now,
    modifiedAt: now,
  };
}

export function createDefaultFileSystem(): FileSystem {
  const root = createFileNode('/', 'directory');
  
  // Create default directories
  const home = createFileNode('home', 'directory');
  const user = createFileNode('user', 'directory');
  const documents = createFileNode('documents', 'directory');
  const projects = createFileNode('projects', 'directory');
  
  // Create default files
  const readme = createFileNode('README.md', 'file', '# Welcome to NishiOS Terminal\n\nType `help` for a list of available commands.');
  const welcomeTxt = createFileNode('welcome.txt', 'file', 'Welcome to the NishiOS terminal! 🚀\n\nThis is a fully functional terminal emulator with:\n- Built-in file system\n- AI chat integration (prefix with "nishito ")\n- Multiple themes\n- Command history\n- And much more!\n\nEnjoy exploring!');
  
  // Build directory structure
  root.children!.set('home', home);
  home.children!.set('user', user);
  user.children!.set('documents', documents);
  user.children!.set('projects', projects);
  user.children!.set('README.md', readme);
  user.children!.set('welcome.txt', welcomeTxt);
  
  return {
    root,
    currentPath: ['home', 'user'],
  };
}

export function saveFileSystem(fs: FileSystem): void {
  const serialized = JSON.stringify({
    root: serializeFileNode(fs.root),
    currentPath: fs.currentPath,
  });
  localStorage.setItem(FILESYSTEM_STORAGE_KEY, serialized);
}

export function loadFileSystem(): FileSystem {
  const stored = localStorage.getItem(FILESYSTEM_STORAGE_KEY);
  if (!stored) {
    return createDefaultFileSystem();
  }
  
  try {
    const parsed = JSON.parse(stored);
    return {
      root: deserializeFileNode(parsed.root),
      currentPath: parsed.currentPath || ['home', 'user'],
    };
  } catch (error) {
    console.error('Failed to load filesystem:', error);
    return createDefaultFileSystem();
  }
}

function serializeFileNode(node: FileNode): any {
  const serialized: any = {
    name: node.name,
    type: node.type,
    content: node.content,
    permissions: node.permissions,
    createdAt: node.createdAt,
    modifiedAt: node.modifiedAt,
  };
  
  if (node.children) {
    serialized.children = Array.from(node.children.entries()).map(([key, child]: [string, FileNode]) => ({
      key,
      value: serializeFileNode(child),
    }));
  }
  
  return serialized;
}

function deserializeFileNode(data: any): FileNode {
  const node: FileNode = {
    name: data.name,
    type: data.type,
    content: data.content,
    permissions: data.permissions,
    createdAt: new Date(data.createdAt),
    modifiedAt: new Date(data.modifiedAt),
  };
  
  if (data.children) {
    node.children = new Map();
    data.children.forEach(({ key, value }: any) => {
      node.children!.set(key, deserializeFileNode(value));
    });
  }
  
  return node;
}

export function navigateToPath(fs: FileSystem, path: string[]): FileNode | null {
  let current = fs.root;
  
  for (const segment of path) {
    if (current.type !== 'directory' || !current.children?.has(segment)) {
      return null;
    }
    current = current.children.get(segment)!;
  }
  
  return current;
}

export function getCurrentDirectory(fs: FileSystem): FileNode | null {
  return navigateToPath(fs, fs.currentPath);
}

export function resolvePath(currentPath: string[], relativePath: string): string[] {
  if (relativePath.startsWith('/')) {
    // Absolute path
    return relativePath.split('/').filter(Boolean);
  }
  
  const segments = relativePath.split('/');
  const result = [...currentPath];
  
  for (const segment of segments) {
    if (segment === '..') {
      result.pop();
    } else if (segment !== '.' && segment !== '') {
      result.push(segment);
    }
  }
  
  return result;
}

export function getAbsolutePath(path: string[]): string {
  return '/' + path.join('/');
}

export function createFile(fs: FileSystem, path: string, content: string = ''): boolean {
  const segments = path.split('/').filter(Boolean);
  const filename = segments.pop();
  
  if (!filename) return false;
  
  const parentDir = segments.length === 0 ? fs.root : navigateToPath(fs, segments);
  
  if (!parentDir || parentDir.type !== 'directory') {
    return false;
  }
  
  if (parentDir.children!.has(filename)) {
    return false; // File already exists
  }
  
  parentDir.children!.set(filename, createFileNode(filename, 'file', content));
  parentDir.modifiedAt = new Date();
  saveFileSystem(fs);
  
  return true;
}

export function createDirectory(fs: FileSystem, path: string): boolean {
  const segments = path.split('/').filter(Boolean);
  const dirname = segments.pop();
  
  if (!dirname) return false;
  
  const parentDir = segments.length === 0 ? fs.root : navigateToPath(fs, segments);
  
  if (!parentDir || parentDir.type !== 'directory') {
    return false;
  }
  
  if (parentDir.children!.has(dirname)) {
    return false; // Directory already exists
  }
  
  parentDir.children!.set(dirname, createFileNode(dirname, 'directory'));
  parentDir.modifiedAt = new Date();
  saveFileSystem(fs);
  
  return true;
}

export function deleteNode(fs: FileSystem, path: string): boolean {
  const segments = path.split('/').filter(Boolean);
  const nodeName = segments.pop();
  
  if (!nodeName) return false;
  
  const parentDir = segments.length === 0 ? fs.root : navigateToPath(fs, segments);
  
  if (!parentDir || parentDir.type !== 'directory' || !parentDir.children!.has(nodeName)) {
    return false;
  }
  
  parentDir.children!.delete(nodeName);
  parentDir.modifiedAt = new Date();
  saveFileSystem(fs);
  
  return true;
}

export function writeFile(fs: FileSystem, path: string, content: string): boolean {
  const segments = path.split('/').filter(Boolean);
  const node = navigateToPath(fs, segments);
  
  if (!node || node.type !== 'file') {
    return false;
  }
  
  node.content = content;
  node.modifiedAt = new Date();
  saveFileSystem(fs);
  
  return true;
}

export function readFile(fs: FileSystem, path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  const node = navigateToPath(fs, segments);
  
  if (!node || node.type !== 'file') {
    return null;
  }
  
  return node.content || '';
}