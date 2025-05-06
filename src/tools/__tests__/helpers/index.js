import { jest } from '@jest/globals';

/**
 * Test Helpers Index
 * 
 * This file exports all test helpers from a single location for easier imports
 */

export * from './fsMocks.js';
export * from './uuidMocks.js';
export * from './taskFixtures.js';
export * from './taskAssertions.js';

/**
 * Utility to wait for a specified time in tests
 * 
 * @param {number} ms Milliseconds to wait
 * @returns {Promise<void>} Promise that resolves after the delay
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a mock for child_process.exec
 * 
 * @param {Object} options Configuration options
 * @param {Object} options.responses Map of command patterns to their responses
 * @param {boolean} options.shouldThrow Whether exec should throw an error
 * @returns {Function} Mock exec function
 */
export function createExecMock(options = {}) {
  const {
    responses = {},
    shouldThrow = false
  } = options;
  
  return jest.fn().mockImplementation((cmd) => {
    if (shouldThrow) {
      return Promise.reject(new Error(`Command failed: ${cmd}`));
    }
    
    // Find matching command pattern
    for (const [pattern, response] of Object.entries(responses)) {
      if (cmd.includes(pattern)) {
        return Promise.resolve({
          stdout: typeof response === 'function' ? response(cmd) : response,
          stderr: ''
        });
      }
    }
    
    // Default response
    return Promise.resolve({
      stdout: '',
      stderr: ''
    });
  });
} 