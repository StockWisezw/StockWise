import React from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export function BulkImport() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Bulk Product Import</h2>
          <p className="text-sm text-zinc-500">Import products, update prices, or adjust stock levels via CSV.</p>
        </div>
        <Button variant="outline" className="bg-white">
          <Download className="mr-2 h-4 w-4" /> Download Template
        </Button>
      </div>

      <Card className="border-2 border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <UploadCloud className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Drag & drop your CSV file here</h3>
          <p className="text-zinc-500 mb-6 text-center max-w-md">
            Support for CSV and Excel files up to 10MB. Ensure your file matches our template structure to avoid import errors.
          </p>
          <div className="flex gap-4">
            <Button>Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center"><FileSpreadsheet className="w-5 h-5 mr-2 text-zinc-400" /> Supported Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-zinc-600">
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Product Name (Required)</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>SKU (Required)</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Retail Price (Required)</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-zinc-300 mr-2"></span>Barcode</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-zinc-300 mr-2"></span>Category</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-zinc-300 mr-2"></span>Wholesale Price</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-zinc-300 mr-2"></span>Cost Price</li>
              <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-zinc-300 mr-2"></span>Opening Stock</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base">Recent Imports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <p className="font-medium text-sm text-zinc-900 line-clamp-1">beverages_update_v2.csv</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">Today, 09:41 AM</span>
                  <span className="text-xs px-1.5 bg-emerald-100 text-emerald-800 rounded">Success</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">45 items</p>
                <p className="text-xs text-zinc-500">Imported</p>
              </div>
            </div>
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <p className="font-medium text-sm text-zinc-900 line-clamp-1">new_stock_batch_7.csv</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">Yesterday, 14:20 PM</span>
                  <span className="text-xs px-1.5 bg-amber-100 text-amber-800 rounded">Partial</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">120 items</p>
                <p className="text-xs text-amber-600">3 failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
