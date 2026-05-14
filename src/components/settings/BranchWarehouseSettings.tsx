import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function BranchWarehouseSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Branches & Warehouses</h3>
          <p className="text-sm text-zinc-500">
            Manage your physical locations, POS tills, and warehouse storage.
          </p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Location</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Setup operational rules for each branch.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Active Tills</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Harare CBD (Main)</TableCell>
                <TableCell>Retail Branch</TableCell>
                <TableCell>145 Jason Moyo Ave, Harare</TableCell>
                <TableCell>3</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bulawayo Depot</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>12 Robert Mugabe Way, Bulawayo</TableCell>
                <TableCell>0</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
