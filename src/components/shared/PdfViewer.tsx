
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PdfViewerProps {
  pdfUrl: string;
  fileName?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, fileName = 'document.pdf' }) => {
  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="p-4 bg-gray-50 dark:bg-slate-900 border-b flex justify-between items-center">
        <h3 className="font-medium text-sm">{fileName}</h3>
        <Button variant="outline" size="sm" onClick={downloadPdf}>
          Download PDF
        </Button>
      </div>
      <div className="flex-1 min-h-[500px] p-4 bg-white dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-800 p-6 rounded border min-h-[400px] whitespace-pre-wrap font-mono text-sm">
          {/* In a real app, this would be an iframe or PDF.js rendering */}
          <p className="text-lg font-bold mb-4">PDF Preview</p>
          <pre className="overflow-auto max-h-[400px] text-xs">{pdfUrl.startsWith('data:') ? '[PDF Content]' : pdfUrl}</pre>
        </div>
      </div>
    </Card>
  );
};

export default PdfViewer;
