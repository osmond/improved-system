import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import BookChordDiagram from '../BookChordDiagram.jsx';
import graphData from '@/data/kindle/book-graph.json';

describe('BookChordDiagram', () => {
  it('renders the expected number of chords', async () => {
    render(<BookChordDiagram data={graphData} />);
    const expected = graphData.links.length;
    await waitFor(() => {
      expect(screen.getAllByTestId('chord').length).toBe(expected);
    });
  });
});

