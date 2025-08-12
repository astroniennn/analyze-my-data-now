import { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { DateRange } from 'react-day-picker';

// Define the shape of the context data
interface DataContextType {
  rawData: any[];
  filteredData: any[];
  dateRange: DateRange | undefined;
  setRawData: (data: any[]) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rawData, setRawDataState] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Basic data processing placeholder
  const processAndSetData = (newData: any[]) => {
    const processedData = newData.filter(row =>
      Object.values(row).some(val => val !== null && val !== '')
    );
    setRawDataState(processedData);
    console.log("Processed and set new raw data:", processedData);
  };

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!dateRange?.from) {
      return rawData; // If no start date, return all data
    }

    return rawData.filter(row => {
      const rowDate = new Date(row.Date);
      if (isNaN(rowDate.getTime())) return false; // Invalid date in data

      const from = dateRange.from as Date;
      // If no 'to' date, filter from the 'from' date onwards
      const to = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : new Date();

      return rowDate >= from && rowDate <= to;
    });
  }, [rawData, dateRange]);

  return (
    <DataContext.Provider value={{ rawData, filteredData, dateRange, setRawData: processAndSetData, setDateRange }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
