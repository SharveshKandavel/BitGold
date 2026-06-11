/// <reference types="vitest/globals" />
import { render, screen } from '@testing-library/react';
import Navigation from '../../Navigation';
import { describe, it, expect, vi } from 'vitest'; // Import vi for mocking
import React from 'react';

// Mock the NavLink component to render nothing
vi.mock('../NavLink', () => ({
  __esModule: true,
  default: () => <></>, // Render a React Fragment
}));

describe('Navigation', () => {
  it('renders the navigation items', () => {
    render(<Navigation activeTab="Home" setActiveTab={() => {}} />);
    const homeButton = screen.getByTestId('home-nav-item');
    expect(homeButton).toBeInTheDocument();
  });
});
