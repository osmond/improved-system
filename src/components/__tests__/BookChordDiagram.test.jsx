import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
  it('renders the expected number of chords', async () => {
    render(<BookChordDiagram data={sampleData} />);
    await waitFor(() => {
      expect(screen.getAllByTestId('chord').length).toBe(sampleData.links.length);
    });
  });
});
