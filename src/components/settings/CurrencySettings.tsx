import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';

const mockCurrencies = [
  { id: '1', code: 'ZWG', name: 'Zimbabwe Gold', symbol: 'ZiG', rate: 1.0, isBase: true, isActive: true },
  { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', rate: 13.56, isBase: false, isActive: true },
  { id: '3', code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 0.72, isBase: false, isActive: true },
];

export function CurrencySettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Multi-Currency Engine</h3>
          <p className="text-sm text-zinc-500">
            Configure exchange rates, base currency, and supported currencies.
          </p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Currency</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base Currency Settings</CardTitle>
          <CardDescription>All reports and global totals use the base currency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Base Currency</Label>
              <Input disabled value="ZWG - Zimbabwe Gold" />
            </div>
            <div className="space-y-2 flex items-end">
              <Button variant="outline">Change Base Currency</Button>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-2 pt-4">
            <div className="flex flex-col space-y-1">
              <Label>Automatic Exchange Rate Updates</Label>
              <span className="text-sm text-zinc-500">
                Automatically fetch daily exchange rates from the RBZ API.
              </span>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Currencies & Rates</CardTitle>
          <CardDescription>Currencies available at POS and in Invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate (to Base)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCurrencies.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.code} 
                    {c.isBase && <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Base</Badge>}
                  </TableCell>
                  <TableCell>{c.symbol}</TableCell>
                  <TableCell>{c.isBase ? '1.000000' : c.rate.toFixed(6)}</TableCell>
                  <TableCell>
                    <Badge variant={c.isActive ? "default" : "secondary"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={c.isBase}>Edit Rate</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
