import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';

const mockTaxRates = [
  { id: '1', name: 'VAT Standard', rate: 15.0, type: 'Percentage', isDefault: true, isActive: true },
  { id: '2', name: 'VAT Zero', rate: 0.0, type: 'Percentage', isDefault: false, isActive: true },
  { id: '3', name: 'Exempt', rate: 0.0, type: 'Percentage', isDefault: false, isActive: true },
];

export function TaxationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Taxation & VAT Configuration</h3>
          <p className="text-sm text-zinc-500">
            Manage your tax rules, calculation methods, and VAT rates.
          </p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Tax Rate</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Engine Settings</CardTitle>
          <CardDescription>Global tax calculation preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>Tax Inclusive Pricing</Label>
              <span className="text-sm text-zinc-500 flex items-center">
                Prices entered in the system already include tax.
              </span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>Enable Multiple Tax Types on Items</Label>
              <span className="text-sm text-zinc-500">
                Allow applying more than one tax rate to a single product.
              </span>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Rates</CardTitle>
          <CardDescription>Defined tax rates for ZIMRA compliance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rate (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTaxRates.map(tax => (
                <TableRow key={tax.id}>
                  <TableCell className="font-medium">
                    {tax.name} {tax.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                  </TableCell>
                  <TableCell>{tax.rate.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Badge variant={tax.isActive ? "default" : "secondary"}>
                      {tax.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
