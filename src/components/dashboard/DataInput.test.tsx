import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataInput } from './DataInput';
import { DataProvider } from '@/context/DataContext';

describe('DataInput', () => {
  it('renders the component correctly', () => {
    const { getByText } = render(
      <DataProvider>
        <DataInput />
      </DataProvider>
    );

    // Check for the title
    expect(getByText(/นำเข้าข้อมูลและบันทึกลง Supabase/)).toBeInTheDocument();

    // Check for the instructional text
    expect(getByText(/รองรับไฟล์: Excel/)).toBeInTheDocument();
  });
});
