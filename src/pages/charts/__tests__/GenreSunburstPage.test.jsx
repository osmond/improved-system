import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import GenreSunburstPage from '../GenreSunburst.jsx';

vi.mock('@/components/genre/GenreSunburst.jsx', () => ({
  default: () => <div data-testid="sunburst-layout" />,
}));

vi.mock('@/components/genre/GenreIcicle.jsx', () => ({
  default: () => <div data-testid="icicle-layout" />,
}));

const mockData = { name: 'root', children: [] };

describe('GenreSunburstPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('toggles between sunburst and icicle layouts', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const user = userEvent.setup();
    render(<GenreSunburstPage />);
    const sunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const icicleButton = screen.getByRole('button', { name: /icicle/i });

    expect(await screen.findByTestId('sunburst-layout')).toBeInTheDocument();
    expect(sunburstButton).toHaveAttribute('aria-pressed', 'true');
    expect(sunburstButton).toHaveClass('bg-primary', 'text-white');
    expect(icicleButton).toHaveAttribute('aria-pressed', 'false');
    expect(icicleButton).not.toHaveClass('bg-primary');
    expect(icicleButton).not.toHaveClass('text-white');
    expect(screen.queryByTestId('icicle-layout')).not.toBeInTheDocument();

    await user.click(icicleButton);
    expect(screen.getByTestId('icicle-layout')).toBeInTheDocument();
    expect(icicleButton).toHaveAttribute('aria-pressed', 'true');
    expect(icicleButton).toHaveClass('bg-primary', 'text-white');
    expect(sunburstButton).toHaveAttribute('aria-pressed', 'false');
    expect(sunburstButton).not.toHaveClass('bg-primary');
    expect(sunburstButton).not.toHaveClass('text-white');
    expect(screen.queryByTestId('sunburst-layout')).not.toBeInTheDocument();

    await user.click(sunburstButton);
    expect(screen.getByTestId('sunburst-layout')).toBeInTheDocument();
    expect(sunburstButton).toHaveAttribute('aria-pressed', 'true');
    expect(sunburstButton).toHaveClass('bg-primary', 'text-white');
    expect(icicleButton).toHaveAttribute('aria-pressed', 'false');
    expect(icicleButton).not.toHaveClass('bg-primary');
    expect(icicleButton).not.toHaveClass('text-white');
  });

  it('disables view buttons while loading', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    render(<GenreSunburstPage />);
    const sunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const icicleButton = screen.getByRole('button', { name: /icicle/i });
    expect(sunburstButton).toBeDisabled();
    expect(icicleButton).toBeDisabled();
  });

  it('renders an error message when the fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('API error'));

    render(<GenreSunburstPage />);

    expect(
      await screen.findByText(/failed to load genre hierarchy/i)
    ).toBeInTheDocument();
  });
});
