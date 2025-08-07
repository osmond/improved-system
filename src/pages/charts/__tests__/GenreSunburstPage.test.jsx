import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import constants from '@/config/constants';
const { UNCLASSIFIED_GENRE } = constants;

vi.mock('@/components/genre/GenreSunburst.jsx', () => ({
  default: ({ data }) => (
    <div data-testid="sunburst">
      {data && data.children.map((c) => c.name).join(',')}
    </div>
  ),
}));

vi.mock('@/components/genre/GenreIcicle.jsx', () => ({
  default: ({ data }) => (
    <div data-testid="icicle">
      {data && data.children.map((c) => c.name).join(',')}
    </div>
  ),
}));

const hierarchy = {
  name: 'root',
  children: [
    { name: 'Fiction', children: [{ name: 'Book A', value: 1 }] },
    { name: 'Unclassified', children: [{ name: 'Book B', value: 2 }] },
  ],
};

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(hierarchy),
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

import GenreSunburstPage from '../GenreSunburst.jsx';

describe('GenreSunburstPage filter', () => {
  it('shows only unclassified items when filtered', async () => {
    const user = userEvent.setup();
    render(<GenreSunburstPage />);
    await screen.findByTestId('sunburst');
    expect(screen.getByTestId('sunburst')).toHaveTextContent('Fiction');
    expect(screen.getByTestId('sunburst')).toHaveTextContent(UNCLASSIFIED_GENRE);
    await user.click(screen.getByRole('button', { name: `Show ${UNCLASSIFIED_GENRE}` }));
    expect(screen.getByTestId('sunburst')).not.toHaveTextContent('Fiction');
    expect(screen.getByTestId('sunburst')).toHaveTextContent(UNCLASSIFIED_GENRE);
  });
});
