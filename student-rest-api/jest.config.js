module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'services/V1/util.service.js',
  ],
  coverageThreshold: { global: { lines: 30 } },
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 10000,

  // Map problematic controllers (legacy syntax / missing credential files) to a
  // generic proxy mock so the route files can be imported without errors.
  moduleNameMapper: {
    // notification.service requires a Firebase JSON credential file
    '../services/V1/notification\\.service':
      '<rootDir>/__tests__/helpers/proxyController.js',
    '../../services/V1/notification\\.service':
      '<rootDir>/__tests__/helpers/proxyController.js',

    // marketing.controller contains a legacy octal literal (03) that Babel rejects
    '../controllers/V1/Institute/marketing\\.controller':
      '<rootDir>/__tests__/helpers/proxyController.js',
    '../../controllers/V1/Institute/marketing\\.controller':
      '<rootDir>/__tests__/helpers/proxyController.js',
  },
};
