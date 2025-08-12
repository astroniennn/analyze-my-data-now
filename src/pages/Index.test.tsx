import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Index from '@/pages/Index'; // Import Index directly
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DataProvider } from '@/context/DataContext';

// Mock the recharts library
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div style={{width: '100%', height: '100%'}}>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

const queryClient = new QueryClient();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>{children}</DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </MemoryRouter>
);

describe('Dashboard Page', () => {
  it('renders the initial state correctly', () => {
    render(<Index />, { wrapper: TestWrapper });
    expect(screen.getByText('Upload a file to see your dashboard.')).toBeInTheDocument();
  });

  it('displays the dashboard after a file is uploaded', async () => {
    const user = userEvent.setup();
    render(<Index />, { wrapper: TestWrapper });

    // Mock file upload
    const csvContent = `Sales,Cost,Date\n100,60,2023-01-15`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    // Wait for dashboard to appear
    await vi.waitFor(() => {
      // Check for an element that only appears after data is loaded
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('Pick a date range')).toBeInTheDocument();
    });
  });
});
