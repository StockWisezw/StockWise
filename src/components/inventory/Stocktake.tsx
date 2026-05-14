import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Search, Plus, Filter, ClipboardList, CheckCircle2, Play } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const stocktakes = [
  { id: 'STK-2024-001', name: 'Q1 Full Inventory Count', status: 'IN_PROGRESS', date: 'Oct 24, 2024', type: 'Full Count', branch: 'Main Warehouse' },
  { id: 'STK-2024-002', name: 'Beverages Cycle Count', status: 'COMPLETED', date: 'Oct 15, 2024', type: 'Cycle Count', branch: 'Harare Store' },
  { id: 'STK-2024-003', name: 'Electronics Spot Check', status: 'REVIEW', date: 'Oct 10, 2024', type: 'Partial', branch: 'Main Warehouse' },
];

export function Stocktake() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Stocktakes</h2>
          <p className="text-sm text-zinc-500">Manage cycle counts, full stocktakes, and variance approvals.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> New Stocktake</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-100 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-800">In Progress</p>
              <p className="text-2xl font-bold text-emerald-900">1</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">Needs Review</p>
              <p className="text-2xl font-bold text-amber-900">1</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800">Completed (30d)</p>
              <p className="text-2xl font-bold text-blue-900">4</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50 rounded-t-xl">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input placeholder="Search stocktakes..." className="pl-9 bg-white" />
          </div>
          <Button variant="outline" className="bg-white whitespace-nowrap"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocktakes.map((stk) => (
              <TableRow key={stk.id}>
                <TableCell className="font-mono text-xs">{stk.id}</TableCell>
                <TableCell className="font-medium">{stk.name}</TableCell>
                <TableCell>{stk.type}</TableCell>
                <TableCell className="text-zinc-500">{stk.branch}</TableCell>
                <TableCell>{stk.date}</TableCell>
                <TableCell>
                  {stk.status === 'IN_PROGRESS' && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">In Progress</Badge>}
                  {stk.status === 'REVIEW' && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Review Variances</Badge>}
                  {stk.status === 'COMPLETED' && <Badge className="bg-zinc-100 text-zinc-600 border-0 hover:bg-zinc-200">Completed</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
