import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataInput } from './DataInput';
import { DataProvider } from '@/context/DataContext'; // Keep the real provider for wrapping
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

// Mock just the parts of the context we need to control/spy on
const mockSetRawData = vi.fn();
const mockSetDateRange = vi.fn();
vi.mock('@/context/DataContext', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual, // Use actual implementation for DataProvider
    useData: () => ({ // Mock only the hook's return value
      rawData: [],
      filteredData: [],
      dateRange: undefined,
      setRawData: mockSetRawData,
      setDateRange: mockSetDateRange,
    }),
  };
});

// Mock Supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: { from: vi.fn().mockReturnThis(), insert: vi.fn() },
}));

// Mock Sonner
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), loading: vi.fn() } }));

describe('DataInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<DataProvider><DataInput /></DataProvider>);
    expect(screen.getByText('Import Data')).toBeInTheDocument();
  });

  it('calls setRawData and Supabase with correct data', async () => {
    (supabase.from('sales_transactions').insert as vi.Mock).mockResolvedValue({ error: null });
    const user = userEvent.setup();
    const csvContent = `"Total Price","ต้นทุน","Doc Date"\n"250","120","2023-05-10"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    render(<DataProvider><DataInput /></DataProvider>);

    await user.upload(screen.getByTestId('file-input'), file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      // Check that setRawData was called. We use `toHaveBeenCalled` because batching might call it multiple times.
      expect(mockSetRawData).toHaveBeenCalled();

      // Check that supabase.insert was called with the correctly transformed data.
      expect(supabase.from).toHaveBeenCalledWith('sales_transactions');
      const insertedData = (supabase.from('sales_transactions').insert as vi.Mock).mock.calls[0][0][0];
      expect(insertedData.total_price).toBe(250);
      expect(insertedData.cost).toBe(120);
      expect(insertedData.doc_date).toBe(new Date('2023-05-10').toISOString());

      expect(toast.success).toHaveBeenCalledWith("Successfully uploaded 1 rows!", { id: undefined });
    });
  });
});
