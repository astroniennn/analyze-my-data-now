import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataInput } from './DataInput';
import { DataProvider } from '@/context/DataContext';
import { supabase } from '@/lib/supabaseClient'; // Import to be mocked
import { toast } from 'sonner';

// Mock the DataContext
const mockSetRawData = vi.fn();
vi.mock('@/context/DataContext', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useData: () => ({
      rawData: [],
      filteredData: [],
      dateRange: undefined,
      setRawData: mockSetRawData,
      setDateRange: vi.fn(),
    }),
  };
});

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn(),
  },
}));

// Mock the toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('DataInput', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mocks before each test
  });

  it('renders the component correctly', () => {
    render(<DataProvider><DataInput /></DataProvider>);
    expect(screen.getByText('Import Data')).toBeInTheDocument();
  });

  it('correctly maps headers and calls setRawData on upload', async () => {
    const user = userEvent.setup();
    const csvContent = `"Total Price"\n"100"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    render(<DataProvider><DataInput /></DataProvider>);

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      expect(mockSetRawData).toHaveBeenCalledTimes(1);
      expect(mockSetRawData.mock.calls[0][0][0]).toEqual({ Sales: '100' });
    });
  });

  it('calls supabase.insert with transformed data and shows success toast', async () => {
    const user = userEvent.setup();
    (supabase.from('sales_transactions').insert as vi.Mock).mockResolvedValueOnce({ error: null });

    const csvContent = `"Total Price"\n"100"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    render(<DataProvider><DataInput /></DataProvider>);

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('sales_transactions');
      expect(supabase.from('sales_transactions').insert).toHaveBeenCalledWith([{ Sales: '100' }]);
      expect(toast.success).toHaveBeenCalledWith("File uploaded and data imported successfully!");
    });
  });

  it('shows an error toast if supabase.insert fails', async () => {
    const user = userEvent.setup();
    const mockError = { message: 'Insert failed' };
    (supabase.from('sales_transactions').insert as vi.Mock).mockResolvedValueOnce({ error: mockError });

    const csvContent = `"Total Price"\n"100"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    render(<DataProvider><DataInput /></DataProvider>);

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Upload failed", { description: mockError.message });
    });
  });
});
