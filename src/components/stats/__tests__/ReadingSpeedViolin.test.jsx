import { render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.getByLabelText('Morning')).toBeInTheDocument();
    expect(screen.getByLabelText('Evening')).toBeInTheDocument();
    expect(screen.getByLabelText('Bandwidth')).toBeInTheDocument();
    await waitFor(() => {
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });
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
});
