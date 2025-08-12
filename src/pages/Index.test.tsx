import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Index from '@/pages/Index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DataProvider } from '@/context/DataContext';
import { supabase } from '@/lib/supabaseClient';

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />, XAxis: () => <div />, YAxis: () => <div />,
  CartesianGrid: () => <div />, Tooltip: () => <div />,
}));

// Mock Supabase to prevent network calls
vi.mock('@/lib/supabaseClient', () => ({
  supabase: { from: vi.fn().mockReturnThis(), insert: vi.fn().mockResolvedValue({ error: null }) },
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

describe('Dashboard Page Integration Test', () => {
  it('renders initial state correctly', () => {
    render(<Index />, { wrapper: TestWrapper });
    expect(screen.getByText('Upload a file to see your dashboard.')).toBeInTheDocument();
  });

  it('calculates and displays KPIs correctly after file upload', async () => {
    const user = userEvent.setup();
    render(<Index />, { wrapper: TestWrapper });

    // Use the Thai headers in the mock CSV
    const csvContent = `"Total Price","ต้นทุน","Doc Date"\n"500","200","2023-01-15"\n"300","150","2023-02-20"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

    await user.upload(screen.getByTestId('file-input'), file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      // Total Sales should be 500 + 300 = 800
      expect(screen.getByText('$800.00')).toBeInTheDocument();

      // Total Profit should be (500 - 200) + (300 - 150) = 300 + 150 = 450
      expect(screen.getByText('$450.00')).toBeInTheDocument();

      // Profit Margin should be (450 / 800) * 100 = 56.25%
      expect(screen.getByText('56.25%')).toBeInTheDocument();
    });
  });
});
