import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar', () => {
  it('renders the logo', () => {
    render(<Navbar currentPage="home" onPageChange={() => {}} />);
    const logo = screen.getByText('🪙');
    expect(logo).toBeInTheDocument();
  });
});
