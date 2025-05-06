export default {
  testEnvironment: 'jest-environment-node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
}; 