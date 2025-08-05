import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import GenreSunburst from '../GenreSunburst';
import { hsl as d3hsl } from 'd3-color';

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

  beforeEach(() => {
    for (let i = 1; i <= 10; i++) {
      document.documentElement.style.setProperty(
        `--chart-${i}`,
        `${(i - 1) * 36} 100% 50%`
      );
    }
  });

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

  it('applies depth-based colors and preserves them on hover and zoom', async () => {
    const user = userEvent.setup();
    const { container } = render(<GenreSunburst data={data} />);
    const svg = container.querySelector('svg');
    const pathA = svg.querySelector('path[data-name="A"]');
    const pathB = svg.querySelector('path[data-name="B"]');
    const pathA1 = svg.querySelector('path[data-name="A1"]');

    const colorA = d3hsl(pathA.getAttribute('fill'));
    const colorB = d3hsl(pathB.getAttribute('fill'));
    const colorA1 = d3hsl(pathA1.getAttribute('fill'));

    const chart1 = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-1')
      .trim();
    const chart1Color = d3hsl(`hsl(${chart1.replace(/\s+/g, ',')})`);

    expect(colorA.h).toBeCloseTo(chart1Color.h, 0);
    expect(colorA.h).not.toBe(colorB.h);
    expect(colorA.h).toBeCloseTo(colorA1.h, 0);
    expect(colorA.s).not.toBe(colorA1.s);
    expect(colorA.l).not.toBe(colorA1.l);

    const initialA1 = pathA1.getAttribute('fill');
    await user.hover(pathA1);
    expect(pathA1.getAttribute('fill')).toBe(initialA1);
    await user.unhover(pathA1);
    expect(pathA1.getAttribute('fill')).toBe(initialA1);

    const initialA = pathA.getAttribute('fill');
    await user.click(pathA);
    await new Promise((r) => setTimeout(r, 800));
    expect(pathA.getAttribute('fill')).toBe(initialA);
  });
});

