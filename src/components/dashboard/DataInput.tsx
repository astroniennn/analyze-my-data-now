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

      // Transform data to match sales_transactions table structure
      const salesData = data.map((row: any) => ({
        user_id: user.id,
        product_code: row['Product (Code)'] || row.product_code || null,
        product_name: row['Product (Name)'] || row.product_name || null,
        number: parseFloat(row.Number || row.number || '0'),
        price_for_profit: parseFloat(row['ราคาขายนำมาคิดกำไร'] || row.price_for_profit || '0'),
        bill_price: parseFloat(row['ราคาขายตามบิล'] || row.bill_price || '0'),
        unit_price: parseFloat(row['ราคาขาย/หน่วย'] || row.unit_price || '0'),
        serial: row.Serial || row.serial || null,
        sum_number: parseFloat(row['Sum Number'] || row.sum_number || '0'),
        category_id: row['Category (ID)'] || row.category_id || null,
        category_name: row['Category (Name)'] || row.category_name || null,
        sub_category: row['Sub Category'] || row.sub_category || null,
        brand: row.Brand || row.brand || null,
        model: row.Model || row.model || null,
        branch_id: row['Branch (ID)'] || row.branch_id || null,
        branch_name: row['Branch (Name)'] || row.branch_name || null,
        doc_no: row['Doc No'] || row.doc_no || null,
        doc_ref: row['Doc Ref'] || row.doc_ref || null,
        doc_date: row['Doc Date'] || row.doc_date || null,
        version: row.Version || row.version || null,
        set_price: parseFloat(row['Set Price'] || row.set_price || '0'),
        cost: parseFloat(row['ต้นทุน'] || row.cost || '0'),
        cost_after_discount: parseFloat(row['ต้นทุนหลังลดหนี้'] || row.cost_after_discount || '0'),
        diff_set: parseFloat(row['Diff Set'] || row.diff_set || '0'),
        diff_cost: parseFloat(row['Diff Cost'] || row.diff_cost || '0'),
        diff_cost_after_discount: parseFloat(row['Diff Cost หลังลดหนี้'] || row.diff_cost_after_discount || '0'),
        total_price: parseFloat(row['Total Price'] || row.total_price || '0'),
        vat_percent: parseFloat(row['Vat (%)'] || row.vat_percent || '0'),
        vat_type: row['Vat Type'] || row.vat_type || null,
        vat_value: parseFloat(row['Vat Value'] || row.vat_value || '0'),
        discount: parseFloat(row.Discount || row.discount || '0'),
        discount_value: parseFloat(row['Discount Value'] || row.discount_value || '0'),
        sell_type: row['Sell Type'] || row.sell_type || null,
        finish: row.Finish || row.finish || null,
        credit_days: parseInt(row['Credit (Days)'] || row.credit_days || '0'),
        buy_bill: row['Buy Bill'] || row.buy_bill || null,
        buy_doc_ref: row['Buy Doc Ref.'] || row.buy_doc_ref || null,
        cus_ref: row['Cus Ref.'] || row.cus_ref || null,
        customer_code: row['Customer (Code)'] || row.customer_code || null,
        customer_name: row['Customer (Name)'] || row.customer_name || null,
        supplier_code: row['Supplier (Code)'] || row.supplier_code || null,
        supplier_name: row['Supplier (Name)'] || row.supplier_name || null,
        officer_id: row['Officer (ID)'] || row.officer_id || null,
        officer_name: row['Officer (Name)'] || row.officer_name || null,
        comment: row.Comment || row.comment || null,
        product_type: row['Product Type'] || row.product_type || null,
        set_product_code: row['SET Product (Code)'] || row.set_product_code || null,
        set_product_name: row['SET Product (Name)'] || row.set_product_name || null,
        set_product_serial: row['SET Product (Serial)'] || row.set_product_serial || null,
        approve: row.Approve || row.approve || null,
        status: row.Status || row.status || null,
        cr_off_id: row['Cr Off (ID)'] || row.cr_off_id || null,
        cr_off_name: row['Cr Off (Name)'] || row.cr_off_name || null,
        create_time: row['Create Time'] || row.create_time || null,
        uoff_id: row['UOff (ID)'] || row.uoff_id || null,
        uoff_name: row['UOff (Name)'] || row.uoff_name || null,
        update_time: row['Update Time'] || row.update_time || null,
        replicate_time: row['Replicate Time'] || row.replicate_time || null,
        counter: parseInt(row.Counter || row.counter || '0')
      }));

      const { error } = await (supabase as any)
        .from('sales_transactions')
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
