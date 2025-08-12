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

const BATCH_SIZE = 1000; // Upload 1000 rows at a time

const headerMapping: { [key:string]: string } = {
  // CSV Header -> Supabase Column
  "Total Price": "total_price",
  "ต้นทุน": "cost",
  "Doc Date": "doc_date",
  "Product (Code)": "product_code",
  "Product (Name)": "product_name",
  "ราคาขายตามบิล": "bill_sale_price",
  "ราคาขาย/หน่วย": "unit_sale_price",
  "Category (Name)": "category_name",
  "Branch (Name)": "branch_name",
  "Officer (Name)": "officer_name",
  "Customer (Name)": "customer_name",
};

const transformRow = (row: any) => {
  const newRow: { [key: string]: any } = {};
  for (const key in row) {
    const newKey = headerMapping[key.trim()] || key.trim();
    const value = row[key];
    switch (newKey) {
      case 'total_price':
      case 'cost':
      case 'bill_sale_price':
      case 'unit_sale_price':
        newRow[newKey] = parseFloat(value) || null;
        break;
      case 'doc_date':
        if (!value) { newRow[newKey] = null; break; }
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
};

export const DataInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setRawData } = useData();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0]);
  };

  const uploadBatch = async (batch: any[]) => {
    if (batch.length === 0) return;
    const { error } = await supabase.from('sales_transactions').insert(batch);
    if (error) throw error;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    setIsLoading(true);
    setRawData([]); // Clear previous data
    const toastId = toast.loading("Starting upload...");

    try {
      if (file.name.endsWith(".csv")) {
        // --- CSV Streaming Upload ---
        let batch: any[] = [];
        let totalRows = 0;
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          step: async (results) => {
            const row = transformRow(results.data);
            batch.push(row);
            totalRows++;
            if (batch.length >= BATCH_SIZE) {
              const currentBatch = [...batch];
              batch = []; // Reset batch
              toast.loading(`Uploading rows ${totalRows - currentBatch.length + 1} to ${totalRows}...`, { id: toastId });
              await uploadBatch(currentBatch);
              setRawData(prev => [...prev, ...currentBatch]);
            }
          },
          complete: async () => {
            if (batch.length > 0) {
              toast.loading(`Uploading final ${batch.length} rows...`, { id: toastId });
              await uploadBatch(batch);
              setRawData(prev => [...prev, ...batch]);
            }
            toast.success(`Successfully uploaded ${totalRows} rows!`, { id: toastId });
            setIsLoading(false);
          },
          error: (err) => {
            throw err;
          }
        });
      } else {
        // --- Excel (Non-streaming) Batch Upload ---
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const binaryStr = event.target?.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const allData = XLSX.utils.sheet_to_json(worksheet);
            const transformedData = allData.map(transformRow);

            setRawData(transformedData); // Show all data locally at once

            for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
              const batch = transformedData.slice(i, i + BATCH_SIZE);
              toast.loading(`Uploading rows ${i + 1} to ${i + batch.length}...`, { id: toastId });
              await uploadBatch(batch);
            }
            toast.success(`Successfully uploaded ${transformedData.length} rows!`, { id: toastId });
          } catch (error: any) {
             toast.error("Upload failed", { id: toastId, description: error.message });
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsBinaryString(file);
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred.", { id: toastId, description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Import Data</CardTitle></CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input data-testid="file-input" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} disabled={isLoading} />
          <Button size="icon" onClick={handleUpload} aria-label="Upload file" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Upload your Excel or CSV file to get started.</p>
      </CardContent>
    </Card>
  );
};
