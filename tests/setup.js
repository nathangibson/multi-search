// tests/setup.js — global browser mock (plain functions, overridable per test)
global.browser = {
  storage: {
    local: {
      get: () => Promise.resolve({}),
      set: () => Promise.resolve(),
    },
  },
};
