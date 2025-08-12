import { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface DataContextType {
  data: any[];
  setData: (data: any[]) => void;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<any[]>([]);

  // Basic data processing placeholder
  const processAndSetData = (newData: any[]) => {
    // Example processing: filter out empty rows
    const processedData = newData.filter(row =>
      Object.values(row).some(val => val !== null && val !== '')
    );
    setDataState(processedData);
    console.log("Processed and set new data:", processedData);
  };

  return (
    <DataContext.Provider value={{ data, setData: processAndSetData }}>
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
