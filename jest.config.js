module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  testRegex: '.test.(ts|tsx?)$',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
}
