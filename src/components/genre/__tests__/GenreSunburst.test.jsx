import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import GenreSunburst from '../GenreSunburst';

describe('GenreSunburst', () => {
  const data = {
    name: 'root',
    children: [
      {
        name: 'A',
        children: [
          { name: 'A1', value: 1 },
          { name: 'A2', value: 1 },
        ],
      },
      { name: 'B', value: 1 },
    ],
  };

  it('updates breadcrumb and zooms on interactions', async () => {
    const user = userEvent.setup();

    const { container } = render(<GenreSunburst data={data} />);
    const svg = container.querySelector('svg');
    const pathA = svg.querySelector('path[data-name="A"]');
    const initial = pathA.getAttribute('d');

    await user.click(pathA);
    await new Promise((r) => setTimeout(r, 800));

    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
    const zoomed = pathA.getAttribute('d');
    expect(zoomed).not.toBe(initial);

    await user.click(screen.getByRole('button', { name: 'root' }));
    await new Promise((r) => setTimeout(r, 800));

    expect(screen.queryByRole('button', { name: 'A' })).not.toBeInTheDocument();
    expect(pathA.getAttribute('d')).toBe(initial);
  });
});

