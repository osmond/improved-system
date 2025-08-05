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

    expect(screen.getByTestId('sunburst-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('icicle-layout')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /icicle/i }));
    expect(screen.getByTestId('icicle-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('sunburst-layout')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sunburst/i }));
    expect(screen.getByTestId('sunburst-layout')).toBeInTheDocument();
  });
});
