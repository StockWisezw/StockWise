import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Sparkles, BrainCircuit, BarChart3, MessageSquare, Save } from 'lucide-react';
import { toast } from 'sonner';

export function AiSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('AI preferences updated successfully');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <div className="flex items-center gap-2">
             <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Tareza AI Hub</h3>
             <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">Beta</span>
           </div>
          <p className="text-sm text-zinc-500 mt-1">Configure Tareza AI capabilities, forecasting sensitivity, and automated responses.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground shadow-sm px-6">
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-indigo-200/60 shadow-sm md:col-span-2 bg-gradient-to-br from-indigo-50/50 to-white">
          <CardHeader className="pb-4 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <CardTitle className="text-lg">Global AI Enablement</CardTitle>
              </div>
              <Switch defaultChecked />
            </div>
            <CardDescription className="mt-1">Turn on/off AI features across the entire ERP platform.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
             <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
               Tareza AI uses advanced language models to help you understand your data, forecast demand, and automate routine tasks. Your data is never used to train public models.
             </p>
          </CardContent>
         </Card>

         <Card className="border-zinc-200/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-zinc-400" />
                <CardTitle className="text-lg">Predictive Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between pb-4 border-b border-zinc-50">
                <div className="flex flex-col space-y-1 pr-4">
                  <Label className="font-semibold text-zinc-900">Demand Forecasting</Label>
                  <span className="text-xs text-zinc-500">
                    AI will analyze sales velocity to predict future stock needs.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
               <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1 pr-4">
                  <Label className="font-semibold text-zinc-900">Automated Restock Alerts</Label>
                  <span className="text-xs text-zinc-500">
                    Generate recommended purchase orders before stock runs out.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
         </Card>

         <Card className="border-zinc-200/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-zinc-400" />
                <CardTitle className="text-lg">Data Processing Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between pb-4 border-b border-zinc-50">
                <div className="flex flex-col space-y-1 pr-4">
                  <Label className="font-semibold text-zinc-900">Smart Receipt OCR</Label>
                  <span className="text-xs text-zinc-500">
                    Automatically extract line items when uploading supplier invoices.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
               <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1 pr-4">
                  <Label className="font-semibold text-zinc-900">Anomaly Detection</Label>
                  <span className="text-xs text-zinc-500">
                    Flag unusual voids, discounts, or inventory shrinks automatically.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
