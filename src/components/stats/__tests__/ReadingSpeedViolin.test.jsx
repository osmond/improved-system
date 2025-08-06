import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import ReadingSpeedViolin, { color } from '../ReadingSpeedViolin';
import '@testing-library/jest-dom';
import readingSpeed from '@/data/kindle/reading-speed.json';

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(readingSpeed),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

  describe('ReadingSpeedViolin', () => {
    it('renders controls and chart', async () => {
      render(<ReadingSpeedViolin />);
      expect(screen.getByLabelText('Chart Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Morning')).toBeInTheDocument();
      expect(screen.getByLabelText('Evening')).toBeInTheDocument();
      expect(screen.getByLabelText('Bandwidth')).toBeInTheDocument();
      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
      });
    });

    it('uses lower default bandwidth and slider range', () => {
      render(<ReadingSpeedViolin />);
      const slider = screen.getByLabelText('Bandwidth');
      expect(slider).toHaveValue('150');
      expect(slider).toHaveAttribute('min', '50');
      expect(slider).toHaveAttribute('max', '1000');
      expect(slider).toHaveAttribute('step', '50');
    });

    it('applies period-specific colors', async () => {
      const { container } = render(<ReadingSpeedViolin />);

    await waitFor(() => {
      expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    });

    const colors = Object.values(color);

    const pathFills = Array.from(container.querySelectorAll('path')).map((el) =>
      el.getAttribute('fill')
    );
    colors.forEach((c) => {
      expect(pathFills).toContain(c);
    });

    Array.from(container.querySelectorAll('rect')).forEach((el) => {
      expect(colors).toContain(el.getAttribute('stroke'));
      expect(colors).toContain(el.getAttribute('fill'));
    });

    const lineStrokes = Array.from(container.querySelectorAll('line')).map(
      (el) => el.getAttribute('stroke')
    );
    colors.forEach((c) => {
      expect(lineStrokes).toContain(c);
    });

    Array.from(container.querySelectorAll('circle')).forEach((el) => {
      expect(colors).toContain(el.getAttribute('fill'));
    });
  });

  it('falls back to local data when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    render(<ReadingSpeedViolin />);

    await waitFor(() => {
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('switches to box plot when selected', async () => {
    const { container } = render(<ReadingSpeedViolin />);

    await waitFor(() => {
      const paths = Array.from(container.querySelectorAll('path')).filter((p) =>
        p.getAttribute('fill') && p.getAttribute('fill') !== 'none'
      );
      expect(paths.length).toBeGreaterThan(0);
    });

    await userEvent.selectOptions(screen.getByLabelText('Chart Type'), 'box');

    await waitFor(() => {
      const violinPaths = Array.from(container.querySelectorAll('path')).filter(
        (p) => p.getAttribute('fill') && p.getAttribute('fill') !== 'none'
      );
      expect(violinPaths.length).toBe(0);
      expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
    });
  });
});
