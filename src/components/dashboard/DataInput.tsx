import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData } from "@/context/DataContext";

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
  const { setData } = useData();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;

      let parsedData: any[] = [];

      if (file.name.endsWith(".csv")) {
        const result = Papa.parse(binaryStr as string, { header: true });
        parsedData = result.data;
      } else {
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet);
      }

      // Transform the data by mapping headers
      const transformedData = parsedData.map(row => {
        const newRow: { [key: string]: any } = {};
        for (const key in row) {
          const newKey = headerMapping[key.trim()] || key.trim();
          newRow[newKey] = row[key];
        }
        return newRow;
      });

      setData(transformedData);
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
          />
          <Button size="icon" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Upload your Excel or CSV file to get started.
        </p>
      </CardContent>
    </Card>
  );
};
