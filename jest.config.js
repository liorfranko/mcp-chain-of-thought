export default {
  testEnvironment: 'jest-environment-jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      isolatedModules: true,
    }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/fileLoader.test.js', '**/__tests__/summaryExtractor.test.js', '**/__tests__/conversation.test.js', '**/__tests__/sse.test.js', '**/__tests__/testUtils.test.js'],
  
  // Coverage configuration
  collectCoverage: false,
  coverageDirectory: 'coverage'
}; 