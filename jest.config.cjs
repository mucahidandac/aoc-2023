/**
 * @type {import('jest').Config}
 */
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  globals: {
    jest: true,
  },
};