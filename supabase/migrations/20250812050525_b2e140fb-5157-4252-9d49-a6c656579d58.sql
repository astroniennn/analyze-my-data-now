-- Create a comprehensive sales transaction table
CREATE TABLE public.sales_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Product Information
  product_code TEXT,
  product_name TEXT,
  number NUMERIC,
  profit_sale_price DECIMAL(15,2),
  bill_sale_price DECIMAL(15,2),
  unit_sale_price DECIMAL(15,2),
  serial TEXT,
  sum_number NUMERIC,
  
  -- Category Information
  category_id TEXT,
  category_name TEXT,
  sub_category TEXT,
  brand TEXT,
  model TEXT,
  
  -- Branch Information
  branch_id TEXT,
  branch_name TEXT,
  
  -- Document Information
  doc_no TEXT,
  doc_ref TEXT,
  doc_date DATE,
  version TEXT,
  
  -- Pricing Information
  set_price DECIMAL(15,2),
  cost DECIMAL(15,2),
  cost_after_debt_reduction DECIMAL(15,2),
  diff_set DECIMAL(15,2),
  diff_cost DECIMAL(15,2),
  diff_cost_after_debt_reduction DECIMAL(15,2),
  total_price DECIMAL(15,2),
  
  -- VAT Information
  vat_percentage DECIMAL(5,2),
  vat_type TEXT,
  vat_value DECIMAL(15,2),
  
  -- Discount Information
  discount DECIMAL(15,2),
  discount_value DECIMAL(15,2),
  
  -- Sale Information
  sell_type TEXT,
  finish TEXT,
  credit_days INTEGER,
  buy_bill TEXT,
  buy_doc_ref TEXT,
  cus_ref TEXT,
  
  -- Customer Information
  customer_code TEXT,
  customer_name TEXT,
  
  -- Supplier Information
  supplier_code TEXT,
  supplier_name TEXT,
  
  -- Officer Information
  officer_id TEXT,
  officer_name TEXT,
  
  -- Additional Information
  comment TEXT,
  product_type TEXT,
  
  -- SET Product Information
  set_product_code TEXT,
  set_product_name TEXT,
  set_product_serial TEXT,
  
  -- Status Information
  approve BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  
  -- Creator Officer Information
  cr_off_id TEXT,
  cr_off_name TEXT,
  
  -- Update Officer Information
  uoff_id TEXT,
  uoff_name TEXT,
  
  -- Timestamps
  create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  replicate_time TIMESTAMP WITH TIME ZONE,
  
  -- Counter
  counter INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own sales transactions" 
ON public.sales_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales transactions" 
ON public.sales_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales transactions" 
ON public.sales_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales transactions" 
ON public.sales_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sales_transactions_updated_at
BEFORE UPDATE ON public.sales_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for update_time column
CREATE OR REPLACE FUNCTION public.update_update_time_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.update_time = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sales_transactions_update_time
BEFORE UPDATE ON public.sales_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_update_time_column();

-- Create indexes for better performance
CREATE INDEX idx_sales_transactions_user_id ON public.sales_transactions(user_id);
CREATE INDEX idx_sales_transactions_product_code ON public.sales_transactions(product_code);
CREATE INDEX idx_sales_transactions_customer_code ON public.sales_transactions(customer_code);
CREATE INDEX idx_sales_transactions_doc_date ON public.sales_transactions(doc_date);
CREATE INDEX idx_sales_transactions_status ON public.sales_transactions(status);