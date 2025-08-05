import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GenreIcicle from '../GenreIcicle';

describe('GenreIcicle', () => {
  const data = {
    name: 'root',
    children: [{ name: 'A', value: 1 }],
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
      return <GenreIcicle data={d} />;
    }

    render(<Wrapper />);

    expect(
      screen.getByTestId('genre-icicle-skeleton')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByTestId('genre-icicle-skeleton')
      ).not.toBeInTheDocument();
    });
  });
});

