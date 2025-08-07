import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BookNetwork from '../network/BookNetwork.jsx';

function createMockGraph() {
  return {
    nodes: [
      { id: 'a', title: 'A', authors: [], tags: [], community: 0 },
      { id: 'b', title: 'B', authors: [], tags: [], community: 0 },
      { id: 'c', title: 'C', authors: [], tags: [], community: 0 }
    ],
    links: [
      { source: 'a', target: 'b', weight: 1 },
      { source: 'b', target: 'c', weight: 1 }
    ]
  };
}

describe('BookNetwork component', () => {
  const originalRO = global.ResizeObserver;
  let resizeCallback;

  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
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


  it('shows sub-genre input and saves override', async () => {
    const { container, getByLabelText, getByText } = render(
      <BookNetwork data={createMockGraph()} />
    );
    act(() => {
      resizeCallback?.([{ contentRect: { width: 600, height: 400 } }]);
    });
    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
    });
    // label rendering
    expect(getByLabelText('Filter by tag')).not.toBeNull();
    expect(getByLabelText('Filter by author')).not.toBeNull();
    fireEvent.click(container.querySelector('[data-id="a"]'));
    const sgInput = await waitFor(() => getByLabelText('Sub-genre'));
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ a: 'Mystery' }) });
    fireEvent.change(sgInput, { target: { value: 'Mystery' } });
    fireEvent.click(getByText('Save'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/kindle/subgenre-overrides',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('clears tag, author, and selection', async () => {
    const { container, getByLabelText, getByText, queryByLabelText } = render(
      <BookNetwork data={createMockGraph()} />
    );
    act(() => {
      resizeCallback?.([{ contentRect: { width: 600, height: 400 } }]);
    });
    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="node"]').length).toBe(3);
    });
    fireEvent.click(container.querySelector('[data-id="a"]'));
    await waitFor(() => getByLabelText('Sub-genre'));
    fireEvent.change(getByLabelText('Filter by tag'), { target: { value: 'tag1' } });
    fireEvent.change(getByLabelText('Filter by author'), { target: { value: 'auth1' } });

    fireEvent.click(getByText('Clear filters'));

    expect(getByLabelText('Filter by tag').value).toBe('');
    expect(getByLabelText('Filter by author').value).toBe('');
    await waitFor(() => {
      expect(queryByLabelText('Sub-genre')).toBeNull();
    });
  });
});
