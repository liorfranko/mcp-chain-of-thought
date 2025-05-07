import { jest } from '@jest/globals';

/**
 * Creates a mock filesystem module with pre-configured responses
 * for common operations
 * 
 * @param {Object} options Configuration options
 * @param {Object} options.files Map of files to their content
 * @param {Object} options.directories Set of directories that exist
 * @param {boolean} options.shouldThrowOnAccess Whether fs.access should throw
 * @returns {Object} Mock fs/promises module
 */
export function createFsMock(options = {}) {
  const {
    files = {},
    directories = new Set(),
    shouldThrowOnAccess = false,
  } = options;

  // In-memory file system for tests
  const fileSystem = new Map(Object.entries(files));
  const directorySet = new Set(directories);

  return {
    access: jest.fn().mockImplementation((path) => {
      if (shouldThrowOnAccess) {
        return Promise.reject(new Error(`ENOENT: no such file or directory, access '${path}'`));
      }
      
      if (fileSystem.has(path) || directorySet.has(path)) {
        return Promise.resolve();
      }
      
      return Promise.reject(new Error(`ENOENT: no such file or directory, access '${path}'`));
    }),
    
    mkdir: jest.fn().mockImplementation((dir, options) => {
      directorySet.add(dir);
      return Promise.resolve();
    }),
    
    readFile: jest.fn().mockImplementation((path, encoding) => {
      if (fileSystem.has(path)) {
        return Promise.resolve(fileSystem.get(path));
      }
      return Promise.reject(new Error(`ENOENT: no such file or directory, open '${path}'`));
    }),
    
    writeFile: jest.fn().mockImplementation((path, data) => {
      fileSystem.set(path, data);
      return Promise.resolve();
    }),
    
    unlink: jest.fn().mockImplementation((path) => {
      if (fileSystem.has(path)) {
        fileSystem.delete(path);
        return Promise.resolve();
      }
      return Promise.reject(new Error(`ENOENT: no such file or directory, unlink '${path}'`));
    }),
    
    // Helper to inspect the current state of the mock filesystem
    _getFileSystem() {
      const filesObj = {};
      fileSystem.forEach((value, key) => {
        filesObj[key] = value;
      });
      
      return {
        files: filesObj,
        directories: Array.from(directorySet)
      };
    },
    
    // Helper to add a file to the mock filesystem
    _addFile(path, content) {
      fileSystem.set(path, content);
    },
    
    // Helper to add a directory to the mock filesystem
    _addDirectory(path) {
      directorySet.add(path);
    }
  };
} 