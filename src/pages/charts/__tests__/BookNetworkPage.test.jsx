import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import BookNetworkPage from '../BookNetwork.jsx';

vi.mock('@/components/network/BookNetwork.jsx', () => ({
  default: () => <div data-testid="book-network" />,
}));

vi.mock('@/components/network/BookChordDiagram.jsx', () => ({
  default: () => <div data-testid="book-chord" />,
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

  it('toggles between network and chord views', async () => {
    render(<BookNetworkPage />);
    await waitFor(() => {
      expect(screen.getByTestId('book-network')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('toggle-view'));
    await waitFor(() => {
      expect(screen.getByTestId('book-chord')).toBeInTheDocument();
    });
  });
});

