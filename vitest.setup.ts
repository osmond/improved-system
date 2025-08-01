if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}

vi.mock('react-map-gl', () => {
  const React = require('react');
  const Mock = (props: any) => React.createElement('div', null, props.children);
  return {
    __esModule: true,
    default: Mock,
    Map: Mock,
    Source: Mock,
    Layer: Mock,
    Marker: (props: any) => React.createElement('div', null, props.children),
  };
});
