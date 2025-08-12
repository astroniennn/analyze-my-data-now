import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataInput } from './DataInput';
import { DataProvider } from '@/context/DataContext';

// Mock the useData hook to spy on the setRawData function
const mockSetRawData = vi.fn();
vi.mock('@/context/DataContext', async (importOriginal) => {
  const actual = await importOriginal();
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

describe('DataInput', () => {
  // Clear mocks before each test
  beforeEach(() => {
    mockSetRawData.mockClear();
  });

  it('renders the component correctly', () => {
    render(
      <DataProvider>
        <DataInput />
      </DataProvider>
    );

    expect(screen.getByText('Import Data')).toBeInTheDocument();
    expect(screen.getByText('Upload your Excel or CSV file to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('correctly maps Thai headers to English keys on CSV upload', async () => {
    const user = userEvent.setup();
    const csvContent = `"Total Price","ต้นทุน","Doc Date"\n"100","60","2023-01-15"`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

    render(
      <DataProvider>
        <DataInput />
      </DataProvider>
    );

    const fileInput = screen.getByTestId('file-input');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload file/i }));

    // Allow FileReader to process
    await vi.waitFor(() => {
      expect(mockSetRawData).toHaveBeenCalledTimes(1);
    });

    const transformedData = mockSetRawData.mock.calls[0][0];

    expect(transformedData).toHaveLength(1);
    expect(transformedData[0]).toEqual({
      Sales: '100',
      Cost: '60',
      Date: '2023-01-15'
    });
  });
});
