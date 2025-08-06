import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import GenreSankeyPage from '../GenreSankey.jsx';

vi.mock('@/components/genre/GenreSankey.jsx', () => ({
  default: () => <div data-testid="genre-sankey" />,
}));

describe('GenreSankeyPage', () => {
  beforeEach(() => {
    Element.prototype.requestFullscreen = vi.fn(function () {
      document.fullscreenElement = this;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    });
    document.exitFullscreen = vi.fn(() => {
      document.fullscreenElement = null;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    });
  });

  it('toggles aria attributes on fullscreen button', async () => {
    const user = userEvent.setup();
    render(<GenreSankeyPage />);

    const button = screen.getByRole('button', { name: 'Enter full screen' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);
    const exitButton = await screen.findByRole('button', {
      name: 'Exit full screen',
    });
    expect(exitButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(exitButton);
    const enterButton = await screen.findByRole('button', {
      name: 'Enter full screen',
    });
    expect(enterButton).toHaveAttribute('aria-pressed', 'false');
  });
});

