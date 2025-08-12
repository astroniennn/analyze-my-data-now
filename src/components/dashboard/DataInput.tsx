import { useState, ChangeEvent, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const DataInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // This effect will listen for messages from the service worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPLOAD_PROGRESS') {
        const { message, status, toastId } = event.data;
        if (status === 'processing') {
            toast.loading(message, { id: toastId });
        } else if (status === 'success') {
            toast.success(message, { id: toastId });
            setIsUploading(false);
        } else if (status === 'error') {
            toast.error(message, { id: toastId, description: event.data.description });
            setIsUploading(false);
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    if (!navigator.serviceWorker.controller) {
        toast.error("Service worker not active. Please refresh the page.");
        return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Sending file to background processor...");

    // Create a Message Channel
    const channel = new MessageChannel();

    // Send the file to the service worker
    navigator.serviceWorker.controller.postMessage(
      {
        type: 'UPLOAD_FILE',
        file: file,
        toastId: toastId,
      },
      [channel.port2]
    );

    // Listen for a response from the service worker on the other port
    channel.port1.onmessage = (event) => {
        if(event.data.status === 'File received by Service Worker') {
            toast.loading("File received. Starting processing in background...", { id: toastId });
            // The component's job is done. The user can close the tab.
            // Further updates will be handled by the global message listener in useEffect.
        } else {
            toast.error("Communication error with background processor.", { id: toastId });
            setIsUploading(false);
        }
    };
  };

  return (
    <Card>
      <CardHeader><CardTitle>Import Data</CardTitle></CardHeader>
      <CardContent>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            data-testid="file-input"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button size="icon" onClick={handleUpload} aria-label="Upload file" disabled={isUploading}>
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Upload your Excel or CSV file to get started.</p>
      </CardContent>
    </Card>
  );
};
