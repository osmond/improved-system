import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { hsl as d3hsl } from 'd3-color';
import GenreIcicle from '../GenreIcicle';

describe('GenreIcicle', () => {
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

  it('maps top-level genres to --chart-1 and reuses token for descendants', () => {
    const { container } = render(<GenreIcicle data={data} />);
    const rectA = container.querySelector('rect[data-name="A"]');
    const rectA1 = container.querySelector('rect[data-name="A1"]');

    const colorA = d3hsl(rectA.getAttribute('fill'));
    const colorA1 = d3hsl(rectA1.getAttribute('fill'));

    const chart1 = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-1')
      .trim();
    const chart1Color = d3hsl(`hsl(${chart1.replace(/\s+/g, ',')})`);

    expect(colorA.h).toBeCloseTo(chart1Color.h, 0);
    expect(colorA.h).toBeCloseTo(colorA1.h, 0);
  });
});
