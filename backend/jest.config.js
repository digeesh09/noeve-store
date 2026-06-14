// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  // Ignore test files and configuration files from coverage
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};
