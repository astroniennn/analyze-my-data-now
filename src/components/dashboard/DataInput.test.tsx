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

  it('transforms and sets data correctly on upload', async () => {
    const user = userEvent.setup();
    const csvContent = `"Total Price","ต้นทุน","Doc Date"\n"150.5","70","2023-01-15"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    render(<DataProvider><DataInput /></DataProvider>);

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      expect(mockSetRawData).toHaveBeenCalledTimes(1);
      const data = mockSetRawData.mock.calls[0][0][0];
      expect(data.Sales).toBe(150.5); // Check for number
      expect(data.Cost).toBe(70); // Check for number
      expect(data.Date).toBe(new Date('2023-01-15').toISOString()); // Check for ISO string
    });
  });

  it('calls supabase.insert with correctly typed data', async () => {
    const user = userEvent.setup();
    (supabase.from('sales_transactions').insert as vi.Mock).mockResolvedValueOnce({ error: null });

    const csvContent = `"Total Price","ต้นทุน","Doc Date"\n"150.5","70","2023-01-15"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    render(<DataProvider><DataInput /></DataProvider>);

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    await vi.waitFor(() => {
      const insertedData = (supabase.from('sales_transactions').insert as vi.Mock).mock.calls[0][0][0];
      expect(insertedData.Sales).toBe(150.5);
      expect(insertedData.Cost).toBe(70);
      expect(insertedData.Date).toBe(new Date('2023-01-15').toISOString());
      expect(toast.success).toHaveBeenCalledWith("File uploaded and data imported successfully!");
    });
  });

  // The error test doesn't need changes as it doesn't inspect the data
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
