import '@testing-library/jest-dom';

// Mock navigator.serviceWorker for vitest in jsdom environment
if (typeof window !== 'undefined' && window.navigator) {
  // JSDOM doesn't have a serviceWorker implementation
  if (!window.navigator.serviceWorker) {
    Object.defineProperty(window.navigator, 'serviceWorker', {
      value: {
        register: async () => Promise.resolve(),
        addEventListener: () => {},
        removeEventListener: () => {},
        controller: {
          postMessage: () => {},
        },
      },
      writable: true,
    });
  }
}
