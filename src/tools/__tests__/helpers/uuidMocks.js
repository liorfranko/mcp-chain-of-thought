import { jest } from '@jest/globals';

/**
 * Creates a mock for uuid v4 function that returns predictable UUIDs
 * 
 * @param {Object} options Configuration options
 * @param {string[]} options.uuids Array of UUIDs to return in sequence
 * @param {string} options.defaultUuid Default UUID to return when sequence is exhausted
 * @returns {Function} Mock uuid v4 function
 */
export function createUuidMock(options = {}) {
  const {
    uuids = [],
    defaultUuid = '00000000-0000-0000-0000-000000000000'
  } = options;
  
  // Create a copy of the UUID array
  const uuidSequence = [...uuids];
  
  // Create a jest mock function
  const mockUuid = jest.fn().mockImplementation(() => {
    if (uuidSequence.length > 0) {
      return uuidSequence.shift();
    }
    return defaultUuid;
  });
  
  // Add helper methods to the mock
  mockUuid._addUuid = (uuid) => {
    uuidSequence.push(uuid);
  };
  
  mockUuid._setUuids = (newUuids) => {
    uuidSequence.length = 0;
    uuidSequence.push(...newUuids);
  };
  
  mockUuid._getRemainingUuids = () => {
    return [...uuidSequence];
  };
  
  return mockUuid;
} 