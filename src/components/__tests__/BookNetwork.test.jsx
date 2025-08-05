import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';

describe('BookNetwork component', () => {
  it('filters nodes by tag', async () => {
    const { container } = render(<BookNetwork />);
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(2);
    });

    const tagInput = container.querySelector('input[placeholder="Filter by tag"]');
    fireEvent.change(tagInput, { target: { value: 'mystery' } });
    await waitFor(() => {
      const nodes = container.querySelectorAll('[data-testid="node"]');
      expect(nodes.length).toBe(1);
    });
  });
});
