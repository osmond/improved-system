import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import GenreSunburstPage from '../GenreSunburst.jsx';

vi.mock('@/components/genre/GenreSunburst.jsx', () => ({
  default: () => <div data-testid="sunburst-layout" />,
}));

vi.mock('@/components/genre/GenreIcicle.jsx', () => ({
  default: () => <div data-testid="icicle-layout" />,
}));

describe('GenreSunburstPage', () => {
  it('toggles between sunburst and icicle layouts', async () => {
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

  it('displays chart description', () => {
    render(<GenreSunburstPage />);
    expect(
      screen.getByText(
        /each slice represents time spent reading in that genre/i
      )
    ).toBeInTheDocument();
  });
});
