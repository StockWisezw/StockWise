import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { AlertTriangle, Server, Hash, FileCode2, Save } from 'lucide-react';
import { toast } from 'sonner';

export function FiscalisationSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Fiscalisation config saved successfully');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Fiscalisation (ZIMRA)</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Configure ZIMRA FDMS integration, API credentials, and device settings.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground shadow-sm px-6">
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Config</>}
        </Button>
      </div>

      <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900">Compliance & Legal Warning</h3>
          <p className="text-sm text-amber-800 mt-1.5 leading-relaxed">
            Ensure your Device ID and Certificates are correctly configured. Providing incorrect details may result in invalid fiscal receipts, transaction rejection, and potential tax penalties. Changes here take immediate effect across all active tills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-200/60 shadow-sm md:col-span-2">
          <CardHeader className="pb-4 border-b border-zinc-100">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-zinc-400" />
                <div>
                  <CardTitle className="text-lg">Global FDMS Configuration</CardTitle>
                  <CardDescription className="mt-1">Main device connection for the ZIMRA Fiscal Data Management System.</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 mt-1">Status: Ready</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiUrl" className="font-semibold text-zinc-900">ZIMRA API Endpoint</Label>
              <Input id="apiUrl" defaultValue="https://fdms.zimra.co.zw/api/v1/" className="h-11 font-mono text-sm bg-zinc-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="font-semibold text-zinc-900">API Certificate / Auth Token</Label>
              <Input id="apiKey" type="password" defaultValue="************************" className="h-11 font-mono tracking-widest text-sm" />
              <p className="text-xs text-zinc-500">Encrypted token provided during ZIMRA registration.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
               <div className="space-y-2">
                 <Label htmlFor="defaultDeviceModel" className="font-semibold text-zinc-900 flex items-center gap-2">
                   <FileCode2 className="w-4 h-4 text-zinc-400" /> Device Model
                 </Label>
                 <Input id="defaultDeviceModel" placeholder="e.g. Virtual FDMS v1.0" defaultValue="Tareza Virtual FDMS" className="h-11" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="deviceSerial" className="font-semibold text-zinc-900 flex items-center gap-2">
                   <Hash className="w-4 h-4 text-zinc-400" /> Device Serial Number
                 </Label>
                 <Input id="deviceSerial" placeholder="Device SN" defaultValue="TRZ-001-9X8R" className="h-11 font-mono uppercase text-sm" />
               </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-200/60 shadow-sm md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Branch Overrides</CardTitle>
            <CardDescription>Configure physical fiscal printers or separate virtual devices per branch.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-center text-zinc-500 py-10 bg-zinc-50/50 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center">
              <Server className="w-8 h-8 text-zinc-300 mb-3" />
              <span className="font-medium text-zinc-700">No branch overrides found</span>
              <span className="mt-1">All branches are currently using the Global Configuration above.</span>
              <Button variant="outline" size="sm" className="mt-4 bg-white">Add Override</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
