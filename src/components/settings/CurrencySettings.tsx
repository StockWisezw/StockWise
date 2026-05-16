import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, ArrowRightLeft, TrendingUp, RefreshCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

const initialCurrencies = [
  { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, isBase: true, isActive: true },
  { id: '2', code: 'ZWG', name: 'Zimbabwe Gold', symbol: 'ZiG', rate: 13.56, isBase: false, isActive: true },
  { id: '3', code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.50, isBase: false, isActive: true },
];

export function CurrencySettings() {
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (id: string, currentRate: number) => {
    setEditingId(id);
    setEditRate(currentRate.toString());
  };

  const handleSave = (id: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      setCurrencies(prev => prev.map(c => c.id === id ? { ...c, rate: parseFloat(editRate) } : c));
      setEditingId(null);
      setIsUpdating(false);
      toast.success('Exchange rate updated successfully');
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Multi-Currency Engine</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Configure exchange rates, base currency, and payment preferences.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white border-zinc-200">
            <RefreshCcw className="mr-2 h-4 w-4 text-zinc-500" /> Sync Market Rates
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Add Currency
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-200/60 shadow-sm overflow-hidden group hover:border-zinc-300 transition-colors">
          <div className="h-1 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <CardTitle className="text-lg">Base Currency</CardTitle>
            </div>
            <CardDescription>Primary currency for all accounting & reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-bold text-2xl text-zinc-800">$</div>
                <div>
                  <div className="font-semibold text-zinc-900">USD - US Dollar</div>
                  <div className="text-xs text-zinc-500 font-mono">System Default</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Automation</CardTitle>
            <CardDescription>Manage how exchange rates are updated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label className="text-sm font-semibold">RBZ Daily Sync</Label>
                <span className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                  Automatically fetch and apply RBZ mid-rates every morning at 08:00 AM.
                </span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label className="text-sm font-semibold">Allow POS Overrides</Label>
                <span className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                  Let cashiers manually adjust exchange rates during checkout.
                </span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200/60 shadow-sm">
        <CardHeader className="pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zinc-400" />
            <CardTitle className="text-lg">Exchange Rates Configuration</CardTitle>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="w-[80px]">Code</TableHead>
                <TableHead>Currency Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="w-[180px]">Exchange Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map(c => (
                <TableRow key={c.id} className="group">
                  <TableCell className="font-bold text-zinc-900">
                    {c.code}
                  </TableCell>
                  <TableCell className="font-medium text-zinc-600">
                    {c.name}
                    {c.isBase && <Badge className="ml-2 bg-primary/10 text-primary border-0 hover:bg-primary/20 text-[10px] py-0">BASE</Badge>}
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500">{c.symbol}</TableCell>
                  <TableCell>
                    {editingId === c.id ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={editRate} 
                          onChange={(e) => setEditRate(e.target.value)}
                          className="h-8 w-24 text-sm font-mono text-right"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="font-mono font-medium text-zinc-800">
                        {c.isBase ? '1.000000' : c.rate.toFixed(4)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-xs font-medium text-zinc-600">{c.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === c.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 text-zinc-500" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button size="sm" className="h-8 bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => handleSave(c.id)} disabled={isUpdating}>
                          <Save className="w-3 h-3 mr-1" /> Save
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 opacity-0 group-hover:opacity-100 transition-opacity" 
                        disabled={c.isBase}
                        onClick={() => handleEdit(c.id, c.rate)}
                      >
                        Edit Rate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
