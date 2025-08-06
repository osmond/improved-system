import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
      expect(
        screen.getByRole('checkbox', { name: 'Morning' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'Evening' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Smoothing')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Show All/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Deep reading/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Normal/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Skimming/i })).toBeInTheDocument();
      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
      });
    });

    it('filters data based on presets', async () => {
      const mockData = [
        { start: '2020-01-01T00:00:00Z', asin: 'A', wpm: 100, period: 'morning' },
        { start: '2020-01-01T00:30:00Z', asin: 'B', wpm: 150, period: 'evening' },
        { start: '2020-01-01T01:00:00Z', asin: 'C', wpm: 250, period: 'morning' },
        { start: '2020-01-01T01:30:00Z', asin: 'D', wpm: 300, period: 'evening' },
        { start: '2020-01-01T02:00:00Z', asin: 'E', wpm: 500, period: 'morning' },
        { start: '2020-01-01T02:30:00Z', asin: 'F', wpm: 700, period: 'evening' },
      ];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });
      render(<ReadingSpeedViolin />);

      await waitFor(() => {
        expect(document.querySelectorAll('circle').length).toBe(6);
      });

      fireEvent.click(screen.getByRole('button', { name: /Deep reading/i }));
      await waitFor(() => {
        expect(document.querySelectorAll('circle').length).toBe(2);
      });

      fireEvent.click(screen.getByRole('button', { name: /Normal/i }));
      await waitFor(() => {
        expect(document.querySelectorAll('circle').length).toBe(2);
      });

      fireEvent.click(screen.getByRole('button', { name: /Skimming/i }));
      await waitFor(() => {
        expect(document.querySelectorAll('circle').length).toBe(2);
      });

      fireEvent.click(screen.getByRole('button', { name: /Show All/i }));
      await waitFor(() => {
        expect(document.querySelectorAll('circle').length).toBe(6);
      });
    });

    it('uses preset smoothing options', () => {
      render(<ReadingSpeedViolin />);
      const select = screen.getByLabelText('Smoothing');
      expect(select).toHaveValue('300');
      const optionValues = Array.from(select.querySelectorAll('option')).map(
        (o) => o.value
      );
      expect(optionValues).toEqual(['100', '300', '600']);
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

    it('shows metadata in tooltip', async () => {
      const mockData = [
        {
          start: '2020-01-01T00:00:00Z',
          asin: 'TEST',
          wpm: 250,
          period: 'morning',
          highlights: 3,
          duration: 1.5,
        },
      ];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      render(<ReadingSpeedViolin />);

      await waitFor(() => {
        expect(document.querySelector('circle')).toBeInTheDocument();
      });

      const circle = document.querySelector('circle');
      fireEvent.mouseOver(circle);

      await waitFor(() => {
        const tooltip = document.querySelector('[style*="opacity: 1"]');
        expect(tooltip.innerHTML).toContain('Highlights: 3');
        expect(tooltip.innerHTML).toContain('Duration: 1.5');
      });
    });

    it('displays density on violin hover', async () => {
      render(<ReadingSpeedViolin />);

      await waitFor(() => {
      expect(document.querySelector('path[fill]:not([fill="none"])')).toBeInTheDocument();
    });

      const path = document.querySelector('path[fill]:not([fill="none"])');
      fireEvent.mouseMove(path);

      await waitFor(() => {
        const tooltip = document.querySelector('[style*="opacity: 1"]');
        expect(tooltip.innerHTML).toMatch(/Density:/);
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
});
