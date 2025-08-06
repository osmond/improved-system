import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import GenreSunburst from '../GenreSunburst';
import { hsl as d3hsl } from 'd3-color';
import { vi } from 'vitest';

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
    const root = document.documentElement;
    root.style.setProperty('--chart-1', '210 100% 45%');
    root.style.setProperty('--chart-2', '214 90% 50%');
  });

    it('renders a skeleton before data resolves', async () => {
    function Wrapper() {
      const [d, setD] = React.useState(null);
      React.useEffect(() => {
        setTimeout(() => setD(data), 0);
      }, []);
      return <GenreSunburst data={d} />;
    }

    render(<Wrapper />);

    expect(
      screen.getByTestId('genre-sunburst-skeleton')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByTestId('genre-sunburst-skeleton')
      ).not.toBeInTheDocument();
    });
  });

    it('updates breadcrumb without root and zooms on interactions', async () => {
    const user = userEvent.setup();

    const { container } = render(<GenreSunburst data={data} />);
    const svg = container.querySelector('svg');
    const pathA = svg.querySelector('path[data-name="A"]');
    const initial = pathA.getAttribute('d');

    await user.click(pathA);
    await new Promise((r) => setTimeout(r, 800));

    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'root' })).not.toBeInTheDocument();
    const zoomed = pathA.getAttribute('d');
    expect(zoomed).not.toBe(initial);
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

    it('falls back to default color when CSS variable is missing', () => {
      document.documentElement.style.removeProperty('--chart-2');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { container } = render(<GenreSunburst data={data} />);
      const pathB = container.querySelector('path[data-name="B"]');
      const colorB = d3hsl(pathB.getAttribute('fill'));
      expect(colorB.s).toBe(0);
      expect(colorB.l).toBeCloseTo(0.5, 1);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

