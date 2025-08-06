import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import BookProgressSpiral from '../BookProgressSpiral.jsx';
import useReadingSessions from '@/hooks/useReadingSessions';

vi.mock('@/hooks/useReadingSessions');

describe('BookProgressSpiral', () => {
  it('shows loading state', () => {
    useReadingSessions.mockReturnValue({ data: null, error: null, isLoading: true });
    const { getByText } = render(<BookProgressSpiral />);
    expect(getByText('Loading sessions...')).toBeInTheDocument();
  });
});

