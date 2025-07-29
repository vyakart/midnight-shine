import { useState, useEffect, useCallback } from 'react';
import type { FileSystem, FileNode } from '../types/terminal';
import {
  loadFileSystem,
  saveFileSystem,
  createFile as fsCreateFile,
  createDirectory as fsCreateDirectory,
  deleteNode as fsDeleteNode,
  writeFile as fsWriteFile,
  readFile as fsReadFile,
  navigateToPath,
  resolvePath,
  getCurrentDirectory,
  getAbsolutePath,
} from '../utils/terminal/filesystem';

export function useFilesystem() {
  const [filesystem, setFilesystem] = useState<FileSystem>(() => loadFileSystem());

  useEffect(() => {
    saveFileSystem(filesystem);
  }, [filesystem]);

  const createFile = useCallback((path: string, content: string = '') => {
    const success = fsCreateFile(filesystem, path, content);
    if (success) {
      setFilesystem({ ...filesystem });
    }
    return success;
  }, [filesystem]);

  const createDirectory = useCallback((path: string) => {
    const success = fsCreateDirectory(filesystem, path);
    if (success) {
      setFilesystem({ ...filesystem });
    }
    return success;
  }, [filesystem]);

  const deleteNode = useCallback((path: string) => {
    const success = fsDeleteNode(filesystem, path);
    if (success) {
      setFilesystem({ ...filesystem });
    }
    return success;
  }, [filesystem]);

  const writeFile = useCallback((path: string, content: string) => {
    const success = fsWriteFile(filesystem, path, content);
    if (success) {
      setFilesystem({ ...filesystem });
    }
    return success;
  }, [filesystem]);

  const readFile = useCallback((path: string) => {
    return fsReadFile(filesystem, path);
  }, [filesystem]);

  const changeDirectory = useCallback((path: string) => {
    const targetPath = path.startsWith('/') 
      ? path.split('/').filter(Boolean)
      : resolvePath(filesystem.currentPath, path);
    
    const targetDir = navigateToPath(filesystem, targetPath);
    
    if (targetDir && targetDir.type === 'directory') {
      setFilesystem({
        ...filesystem,
        currentPath: targetPath,
      });
      return true;
    }
    return false;
  }, [filesystem]);

  const getCurrentPath = useCallback(() => {
    return getAbsolutePath(filesystem.currentPath);
  }, [filesystem]);

  const listDirectory = useCallback((path?: string): FileNode[] => {
    const targetPath = path 
      ? resolvePath(filesystem.currentPath, path)
      : filesystem.currentPath;
    
    const dir = navigateToPath(filesystem, targetPath);
    
    if (dir && dir.type === 'directory' && dir.children) {
      return Array.from(dir.children.values());
    }
    return [];
  }, [filesystem]);

  const getNode = useCallback((path: string): FileNode | null => {
    const targetPath = path.startsWith('/')
      ? path.split('/').filter(Boolean)
      : resolvePath(filesystem.currentPath, path);
    
    return navigateToPath(filesystem, targetPath);
  }, [filesystem]);

  const resetFilesystem = useCallback(() => {
    localStorage.removeItem('nishitos-filesystem');
    const newFs = loadFileSystem();
    setFilesystem(newFs);
  }, []);

  return {
    filesystem,
    createFile,
    createDirectory,
    deleteNode,
    writeFile,
    readFile,
    changeDirectory,
    getCurrentPath,
    getCurrentDirectory: () => getCurrentDirectory(filesystem),
    listDirectory,
    getNode,
    resetFilesystem,
  };
}