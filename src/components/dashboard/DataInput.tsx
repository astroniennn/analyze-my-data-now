import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle, AlertCircle, Database } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData } from "@/context/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DataInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { setData } = useData();
  const { toast } = useToast();

  const saveToSupabase = async (data: any[]) => {
    setIsSaving(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "ต้องเข้าสู่ระบบ",
          description: "กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล",
          variant: "destructive",
        });
        return;
      }

      // Transform data to match sales table structure
      const salesData = data.map((row: any) => ({
        user_id: user.id,
        product: row.Product || row.product || row.สินค้า || null,
        customer_name: row.Customer || row.customer_name || row.ลูกค้า || null,
        quantity: parseInt(row.Quantity || row.quantity || row.จำนวน || '1'),
        unit_price: parseFloat(row.Price || row.unit_price || row.ราคา || '0'),
        total_amount: parseFloat(row.Total || row.total_amount || row.รวม || row.Sales || '0'),
        sale_date: row.Date || row.sale_date || row.วันที่ || new Date().toISOString().split('T')[0],
        status: row.Status || row.status || row.สถานะ || 'pending',
        notes: row.Notes || row.notes || row.หมายเหตุ || null,
      }));

      const { error } = await supabase
        .from('sales')
        .insert(salesData);

      if (error) {
        throw error;
      }

      toast({
        title: "บันทึกสำเร็จ!",
        description: `บันทึกข้อมูล ${salesData.length} รายการลง Supabase แล้ว`,
      });

    } catch (error: any) {
      console.error('Error saving to Supabase:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "กรุณาเลือกไฟล์",
        description: "กรุณาเลือกไฟล์ CSV หรือ Excel ก่อนอัพโหลด",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const binaryStr = event.target?.result;
          let parsedData: any[] = [];

          if (file.name.endsWith(".csv")) {
            const result = Papa.parse(binaryStr as string, { 
              header: true,
              skipEmptyLines: true,
              transformHeader: (header) => header.trim()
            });
            parsedData = result.data as any[];
          } else {
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            parsedData = XLSX.utils.sheet_to_json(worksheet, { 
              defval: "",
              blankrows: false 
            });
          }

          // Filter out empty rows
          const filteredData = parsedData.filter(row => 
            Object.values(row).some(value => value !== null && value !== undefined && value !== "")
          );

          // Save to Supabase
          await saveToSupabase(filteredData);

          setData(filteredData);
          setUploadStatus('success');
          
          toast({
            title: "อัพโหลดสำเร็จ!",
            description: `นำเข้าข้อมูล ${filteredData.length} รายการแล้ว และบันทึกลง Supabase`,
          });
          
        } catch (error) {
          console.error("Error parsing file:", error);
          setUploadStatus('error');
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบไฟล์",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        setUploadStatus('error');
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถอ่านไฟล์ได้",
          variant: "destructive",
        });
      };

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
      
    } catch (error) {
      setIsUploading(false);
      setUploadStatus('error');
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถประมวลผลไฟล์ได้",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    if (isUploading || isSaving) return <Upload className="h-4 w-4 animate-pulse" />;
    if (uploadStatus === 'success') return <CheckCircle className="h-4 w-4 text-success" />;
    if (uploadStatus === 'error') return <AlertCircle className="h-4 w-4 text-destructive" />;
    return <Upload className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isSaving) return "กำลังบันทึก...";
    if (isUploading) return "กำลังอัพโหลด...";
    if (uploadStatus === 'success') return "อัพโหลดสำเร็จ!";
    if (uploadStatus === 'error') return "เกิดข้อผิดพลาด";
    return "อัพโหลดไฟล์";
  };

  return (
    <Card className="bg-gradient-card border-accent/20 shadow-elegant transition-all duration-300 hover:shadow-hover">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          นำเข้าข้อมูลและบันทึกลง Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-colors cursor-pointer"
              disabled={isUploading || isSaving}
            />
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{file.name}</span>
                <span className="text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button 
                onClick={handleUpload}
                disabled={isUploading || isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200"
                size="sm"
              >
                {getStatusIcon()}
                <span className="ml-2">{getStatusText()}</span>
              </Button>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>รองรับไฟล์: Excel (.xlsx, .xls) และ CSV</p>
          <p>ขนาดไฟล์สูงสุด: 10MB</p>
          <p>คอลัมน์ที่รองรับ: Product, Customer, Quantity, Price, Total, Date, Status, Notes</p>
        </div>

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm text-success font-medium">
              ข้อมูลได้ถูกนำเข้าและบันทึกลง Supabase เรียบร้อยแล้ว
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
