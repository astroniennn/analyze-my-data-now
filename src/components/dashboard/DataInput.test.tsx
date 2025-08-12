import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataInput } from './DataInput';
import { DataProvider } from '@/context/DataContext';

describe('DataInput', () => {
  it('renders the component correctly', () => {
    render(
      <DataProvider>
        <DataInput />
      </DataProvider>
    );

    // Check for the title
    expect(screen.getByText('Import Data')).toBeInTheDocument();

    // Check for the instructional text
    expect(screen.getByText('Upload your Excel or CSV file to get started.')).toBeInTheDocument();

    // Check for the upload button by its role
    const uploadButton = screen.getByRole('button');
    expect(uploadButton).toBeInTheDocument();
  });
});
