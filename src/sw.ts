/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { supabase } from './lib/supabaseClient'; // Use the same client
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

declare let self: ServiceWorkerGlobalScope;

const BATCH_SIZE = 1000;

const headerMapping: { [key:string]: string } = {
  "Total Price": "total_price", "ต้นทุน": "cost", "Doc Date": "doc_date",
  "Product (Code)": "product_code", "Product (Name)": "product_name",
  "ราคาขายตามบิล": "bill_sale_price", "ราคาขาย/หน่วย": "unit_sale_price",
  "Category (Name)": "category_name", "Branch (Name)": "branch_name",
  "Officer (Name)": "officer_name", "Customer (Name)": "customer_name",
};

const transformRow = (row: any) => {
  const newRow: { [key: string]: any } = {};
  for (const key in row) {
    const newKey = headerMapping[key.trim()] || key.trim();
    const value = row[key];
    switch (newKey) {
      case 'total_price': case 'cost': case 'bill_sale_price': case 'unit_sale_price':
        newRow[newKey] = parseFloat(value) || null;
        break;
      case 'doc_date':
        if (!value) { newRow[newKey] = null; break; }
        const date = new Date(value);
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

const uploadBatch = async (batch: any[]) => {
  if (batch.length === 0) return;
  const { error } = await supabase.from('sales_transactions').insert(batch);
  if (error) throw error;
};

const postProgress = async (message: string, status: 'processing' | 'success' | 'error', toastId: string, description?: string) => {
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
        client.postMessage({ type: 'UPLOAD_PROGRESS', message, status, toastId, description });
    });
};


self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPLOAD_FILE') {
    const { file, toastId } = event.data;

    // Acknowledge receipt
    event.ports[0].postMessage({ status: 'File received by Service Worker' });

    const handleProcessing = async () => {
        try {
            if (file.name.endsWith(".csv")) {
                let batch: any[] = [];
                let totalRows = 0;
                Papa.parse(file, {
                  header: true,
                  skipEmptyLines: true,
                  step: async (results) => {
                    batch.push(transformRow(results.data));
                    totalRows++;
                    if (batch.length >= BATCH_SIZE) {
                      const currentBatch = [...batch];
                      batch = [];
                      await postProgress(`Uploading rows ${totalRows - BATCH_SIZE + 1} to ${totalRows}...`, 'processing', toastId);
                      await uploadBatch(currentBatch);
                    }
                  },
                  complete: async () => {
                    if (batch.length > 0) {
                      await postProgress(`Uploading final ${batch.length} rows...`, 'processing', toastId);
                      await uploadBatch(batch);
                    }
                    await postProgress(`Successfully uploaded ${totalRows} rows!`, 'success', toastId);
                  },
                  error: async (err: any) => { throw err; }
                });
            } else { // Excel file
                const buffer = await file.arrayBuffer();
                const workbook = XLSX.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const allData = XLSX.utils.sheet_to_json(worksheet);
                const transformedData = allData.map(transformRow);

                for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
                    const batch = transformedData.slice(i, i + BATCH_SIZE);
                    await postProgress(`Uploading rows ${i + 1} to ${i + batch.length}...`, 'processing', toastId);
                    await uploadBatch(batch);
                }
                await postProgress(`Successfully uploaded ${transformedData.length} rows!`, 'success', toastId);
            }
        } catch (error: any) {
            await postProgress("Upload failed", 'error', toastId, error.message);
        }
    };

    handleProcessing();
  }
});

precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });
