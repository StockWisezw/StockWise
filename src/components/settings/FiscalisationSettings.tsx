import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { AlertTriangle } from 'lucide-react';

export function FiscalisationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Fiscalisation (ZIMRA)</h3>
          <p className="text-sm text-zinc-500">
            Configure ZIMRA FDMS integration, API credentials, and device settings.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-yellow-800">Compliance Warning</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Ensure your Device ID and Certificates are correctly configured. Providing incorrect details may result in invalid fiscal receipts and tax penalties.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Global FDMS Configuration</span>
            <Badge variant="outline" className="text-zinc-500 bg-zinc-50">Offline Queue Ready</Badge>
          </CardTitle>
          <CardDescription>Setup your primary API connection for the ZIMRA Fiscal Data Management System.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">ZIMRA API Endpoint</Label>
            <Input id="apiUrl" defaultValue="https://fdms.zimra.co.zw/api/v1/" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Certificate/Key</Label>
            <Input id="apiKey" type="password" placeholder="Enter Base64 Certificate or Token" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="defaultDeviceModel">Default Device Model</Label>
               <Input id="defaultDeviceModel" placeholder="e.g. Virtual FDMS v1.0" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="deviceSerial">Global Device Serial</Label>
               <Input id="deviceSerial" placeholder="Device SN" />
             </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Configuration</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Branch Overrides</CardTitle>
          <CardDescription>Configure physical fiscal printers or separate virtual devices per branch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-center text-zinc-500 py-6 border-2 border-dashed rounded-lg">
            No branch overrides configured. All branches use Global Configuration.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
