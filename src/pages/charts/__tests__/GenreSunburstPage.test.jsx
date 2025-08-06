import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import GenreSunburstPage from '../GenreSunburst.jsx';
vi.mock('@/data/kindle/genre-hierarchy.json', () => {
  const { UNCLASSIFIED_GENRE } = require('../../../config/constants');
  return {
    default: {
      name: 'root',
      children: [
        {
          name: 'Fiction',
          children: [
            {
              name: 'Mystery',
              children: [
                {
                  name: 'Author A',
                  children: [{ name: 'Book One', value: 30 }],
                },
              ],
            },
          ],
        },
        {
          name: UNCLASSIFIED_GENRE,
          children: [
            {
              name: UNCLASSIFIED_GENRE,
              children: [
                {
                  name: UNCLASSIFIED_GENRE,
                  children: [{ name: 'Book Two', value: 15 }],
                },
              ],
            },
          ],
        },
      ],
    },
  };
});

import { UNCLASSIFIED_GENRE } from '../../../config/constants';

describe('GenreSunburstPage', () => {
  it('filters to unclassified branch', async () => {
    const user = userEvent.setup();
    const { container } = render(<GenreSunburstPage />);
    await waitFor(() => {
      expect(container.querySelector('path[data-name="Fiction"]')).toBeInTheDocument();
    });
    const button = screen.getByRole('button', { name: /Unclassified Only/i });
    await user.click(button);
    await waitFor(() => {
      expect(container.querySelector('path[data-name="Fiction"]')).not.toBeInTheDocument();
    });
    expect(
      container.querySelector(`path[data-name="${UNCLASSIFIED_GENRE}"]`)
    ).toBeInTheDocument();
  });
});
