import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData } from "@/context/DataContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// Define the mapping from Thai headers to English keys
const headerMapping: { [key: string]: string } = {
  "Total Price": "Sales",
  "ต้นทุน": "Cost",
  "Doc Date": "Date",
  "Product (Name)": "ProductName",
  "Category (Name)": "CategoryName",
  "Branch (Name)": "BranchName",
  "Officer (Name)": "OfficerName",
};

export const DataInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setRawData } = useData();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const binaryStr = event.target?.result;
        let parsedData: any[] = [];

        if (file.name.endsWith(".csv")) {
          const result = Papa.parse(binaryStr as string, { header: true, skipEmptyLines: true });
          parsedData = result.data;
        } else {
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
        }

        const transformedData = parsedData.map(row => {
          const newRow: { [key: string]: any } = {};
          for (const key in row) {
            const newKey = headerMapping[key.trim()] || key.trim();
            const value = row[key];

            // Type casting based on the new key
            switch (newKey) {
              case 'Sales':
              case 'Cost':
                newRow[newKey] = parseFloat(value) || null;
                break;
              case 'Date':
                const date = new Date(value);
                // Handle Excel's integer date format
                if (!isNaN(value) && Math.abs(value) < 400000) {
                   const excelEpoch = new Date(1899, 11, 30);
                   const correctDate = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
                   newRow[newKey] = isNaN(correctDate.getTime()) ? null : correctDate.toISOString();
                } else {
                   newRow[newKey] = isNaN(date.getTime()) ? null : date.toISOString();
                }
                break;
              default:
                newRow[newKey] = value;
                break;
            }
          }
          return newRow;
        });

        // Also set data for local dashboard view
        setRawData(transformedData);

        // Upload to Supabase
        const { error } = await supabase
          .from('sales_transactions')
          .insert(transformedData);

        if (error) {
          console.error('Supabase error:', error); // Log the full error
          throw error;
        }

        toast.success("File uploaded and data imported successfully!");

      } catch (error: any) {
        toast.error("Upload failed", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
        toast.error("Failed to read the file.");
        setIsLoading(false);
    };

    if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            data-testid="file-input"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleUpload} aria-label="Upload file" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Upload your Excel or CSV file to get started.
        </p>
      </CardContent>
    </Card>
  );
};
