// Mock implementation for uuid module that doesn't use jest
let counter = 0;

// Simple mock functions that return predictable values
export function v4() {
  counter++;
  return `test-uuid-${counter}`;
}

// Add other uuid exports that might be used
export function v1() {
  return 'test-uuid-v1-mock';
}

export function v3() {
  return 'test-uuid-v3-mock';
}

export function v5() {
  return 'test-uuid-v5-mock';
}

export function validate() {
  return true;
}

export function version() {
  return 4;
}

export const NIL = '00000000-0000-0000-0000-000000000000'; 