if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}

if (typeof globalThis.URL.createObjectURL === 'undefined') {
  globalThis.URL.createObjectURL = () => ''
}

if (
  typeof globalThis.Element !== 'undefined' &&
  typeof globalThis.Element.prototype.scrollIntoView !== 'function'
) {
  globalThis.Element.prototype.scrollIntoView = () => {}
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  // Simple matchMedia polyfill for tests
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as any
}
