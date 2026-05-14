import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, PackageCheck, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table as ShadcnTable,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';

const mockPOs = [
  { id: 'PO-2024-089', supplier: 'National Foods Ltd', date: 'Oct 24, 2024', expected: 'Oct 26, 2024', total: 4500.00, status: 'APPROVED', items: 12 },
  { id: 'PO-2024-088', supplier: 'Delta Beverages', date: 'Oct 23, 2024', expected: 'Oct 24, 2024', total: 1250.00, status: 'RECEIVING', items: 4 },
  { id: 'PO-2024-087', supplier: 'ZimOil Traders', date: 'Oct 20, 2024', expected: 'Oct 21, 2024', total: 3200.00, status: 'RECEIVED', items: 2 },
  { id: 'PO-2024-086', supplier: 'ProBrands ZW', date: 'Oct 19, 2024', expected: 'Oct 25, 2024', total: 850.00, status: 'DRAFT', items: 8 },
];

export function Procurement() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DRAFT': return <Badge variant="outline" className="text-zinc-500">Draft</Badge>;
      case 'PENDING': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">Pending Approval</Badge>;
      case 'APPROVED': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">Approved / Sent</Badge>;
      case 'RECEIVING': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0">Partial Receipt</Badge>;
      case 'RECEIVED': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">Fully Received</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search POs by number, supplier..." 
            className="pl-9 bg-white shadow-sm border-zinc-200 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="bg-white shadow-sm"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"><Plus className="mr-2 h-4 w-4" /> Create PO</Button>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <ShadcnTable>
            <TableHeader className="bg-zinc-50/80 border-b border-zinc-200">
              <TableRow>
                <TableHead className="w-[120px]">PO Number</TableHead>
                <TableHead className="w-[200px]">Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPOs.map((po) => (
                <TableRow key={po.id} className="hover:bg-zinc-50/50 cursor-pointer">
                  <TableCell className="font-mono text-sm font-medium text-blue-600">{po.id}</TableCell>
                  <TableCell className="font-semibold text-zinc-900">{po.supplier}</TableCell>
                  <TableCell className="text-sm text-zinc-600">{po.date}</TableCell>
                  <TableCell className="text-sm text-zinc-600">{po.expected}</TableCell>
                  <TableCell className="text-center text-sm">{po.items}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-zinc-900">${po.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(po.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ShadcnTable>
        </div>
      </Card>
    </div>
  );
}
