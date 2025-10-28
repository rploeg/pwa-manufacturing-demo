import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '@/features/home/HomePage';

describe('HomePage', () => {
  it('renders dashboard heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('shows current shift information', () => {
    render(<HomePage />);
    expect(screen.getByText(/current shift/i)).toBeInTheDocument();
    expect(screen.getByText(/line-b/i)).toBeInTheDocument();
  });

  it('displays KPI metrics', () => {
    render(<HomePage />);
    expect(screen.getByText(/key metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/oee/i)).toBeInTheDocument();
  });
});
