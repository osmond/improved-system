import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import BookChordDiagram from '../network/BookChordDiagram.jsx';

const sampleData = {
  nodes: [
    { id: 'a', title: 'Book A' },
    { id: 'b', title: 'Book B' },
    { id: 'c', title: 'Book C' }
  ],
  links: [
    { source: 'a', target: 'b', weight: 1 },
    { source: 'b', target: 'c', weight: 1 }
  ]
};

describe('BookChordDiagram', () => {
  it('renders chords, labels and tooltips', async () => {
    const { container } = render(<BookChordDiagram data={sampleData} />);
    await waitFor(() => {
      expect(screen.getAllByTestId('chord')).toHaveLength(sampleData.links.length);
      expect(screen.getAllByTestId('label')).toHaveLength(sampleData.nodes.length);
    });

    const titles = Array.from(
      container.querySelectorAll('path[data-testid="chord"] title')
    ).map((t) => t.textContent);
    expect(titles).toContain('Book A → Book B');
    expect(titles).toContain('Book B → Book C');
  });
});
