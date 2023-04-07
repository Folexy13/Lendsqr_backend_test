module.exports = {
  // The test environment that will be used for testing
  testEnvironment: "node",

  // The root directory that Jest should scan for tests and modules within
  rootDir: "./",

  // A list of file extensions to use when looking for test files
  testMatch: ["**/dist/test/**/*.test.js"],

  // A list of paths to directories that Jest should use to search for modules
  moduleDirectories: ["node_modules"],

  // A list of file extensions to use when resolving modules
  moduleFileExtensions: ["js", "json"],

  // A list of paths to modules that should be mocked in tests
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // A list of paths to modules that should not be transformed by Jest
  transformIgnorePatterns: ["<rootDir>/node_modules/"],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**/*.js"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of reporter names that Jest should use
  reporters: ["default"],

  // The maximum amount of time (in milliseconds) that Jest will wait for a test to complete
  testTimeout: 50000,
};
