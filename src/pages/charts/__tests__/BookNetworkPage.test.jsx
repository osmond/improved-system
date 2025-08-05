import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import BookNetworkPage from '../BookNetwork.jsx';

vi.mock('@/components/network/BookNetwork.jsx', () => ({
  default: () => <div data-testid="book-network" />,
}));

describe('BookNetworkPage', () => {
  it('displays a skeleton before data resolves', async () => {
    render(<BookNetworkPage />);

    expect(
      screen.getByTestId('book-network-skeleton')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('book-network')).toBeInTheDocument();
    });
  });
});

