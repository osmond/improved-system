import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import BookChordDiagram from '../network/BookChordDiagram.jsx';

const sampleData = {
  nodes: [
    { id: 'a' },
    { id: 'b' },
    { id: 'c' }
  ],
  links: [
    { source: 'a', target: 'b', weight: 1 },
    { source: 'b', target: 'c', weight: 1 }
  ]
};

describe('BookChordDiagram', () => {
  const originalRO = global.ResizeObserver;
  let resizeCallback;

  beforeEach(() => {
    resizeCallback = undefined;
    global.ResizeObserver = class {
      constructor(cb) {
        resizeCallback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    global.ResizeObserver = originalRO;
  });

  it('renders the expected number of chords', async () => {
    render(<BookChordDiagram data={sampleData} />);
    act(() => {
      resizeCallback?.([{ contentRect: { width: 600, height: 400 } }]);
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('chord').length).toBe(sampleData.links.length);
    });
  });

  it('updates SVG size when container resizes', async () => {
    const { container } = render(<BookChordDiagram data={sampleData} />);
    act(() => {
      resizeCallback?.([{ contentRect: { width: 300, height: 200 } }]);
    });
    await waitFor(() => {
      const svg = container.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('300');
      expect(svg.getAttribute('height')).toBe('200');
    });
    act(() => {
      resizeCallback?.([{ contentRect: { width: 400, height: 250 } }]);
    });
    await waitFor(() => {
      const svg = container.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('400');
      expect(svg.getAttribute('height')).toBe('250');
    });
  });
});
