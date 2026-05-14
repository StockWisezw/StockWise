import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, TrendingUp, DollarSign, CalendarClock, Download, Banknote, CreditCard } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const upcomingPayables = [
  { id: 'PINV-2024-001', supplier: 'National Foods Ltd', amount: 8500.00, dueDate: 'Today', status: 'Due Now' },
  { id: 'PINV-2024-012', supplier: 'Delta Beverages', amount: 4200.00, dueDate: '3 Days', status: 'Upcoming' },
  { id: 'PINV-2024-005', supplier: 'ZimOil Traders', amount: 1200.00, dueDate: '-5 Days', status: 'Overdue' },
];

export function SupplierPayables() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-100 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total Payables</CardTitle>
            <Banknote className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-red-900">$45,210</div>
            <p className="text-xs text-red-700 mt-1">Across 18 supplier accounts</p>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Overdue (Current)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-red-950">$8,500</div>
            <p className="text-xs text-red-800 mt-1">Needs immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Due 1-15 Days</CardTitle>
            <CalendarClock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-amber-900">$12,400</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Paid (30d)</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-emerald-900">$32,100</div>
            <p className="text-xs text-emerald-600 mt-1">Cash outflow related to purchases</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-zinc-200">
          <div className="flex items-center justify-between p-6 pb-2">
            <div>
              <CardTitle>Accounts Payable Aging</CardTitle>
              <CardDescription>Breakdown of outstanding supplier debt by age</CardDescription>
            </div>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-4">
               {/* Visual progress bar representation of aging */}
               <div className="flex h-12 w-full rounded-lg overflow-hidden shadow-sm">
                 <div className="bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700 whitespace-nowrap" style={{ width: '40%' }}>Not Due (40%)</div>
                 <div className="bg-amber-300 flex items-center justify-center text-xs font-bold text-amber-900 whitespace-nowrap" style={{ width: '30%' }}>1-15 Days (30%)</div>
                 <div className="bg-orange-400 flex items-center justify-center text-xs font-bold text-orange-900 whitespace-nowrap" style={{ width: '20%' }}>16-30 Days (20%)</div>
                 <div className="bg-red-500 flex items-center justify-center text-xs font-bold text-white whitespace-nowrap" style={{ width: '10%' }}>&gt;30 Days (10%)</div>
               </div>

               <div className="grid grid-cols-4 gap-4 pt-4 border-t border-zinc-100">
                  <div className="text-center">
                    <p className="text-zinc-500 text-sm">Not Due</p>
                    <p className="font-bold font-mono mt-1">$18,084</p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-500 text-sm">1-15 Days</p>
                    <p className="font-bold font-mono mt-1">$13,563</p>
                  </div>
                  <div className="text-center border-l border-zinc-100">
                    <p className="text-zinc-500 text-sm">16-30 Days</p>
                    <p className="font-bold font-mono mt-1 text-orange-600">$9,042</p>
                  </div>
                  <div className="text-center border-l border-zinc-100">
                    <p className="text-zinc-500 text-sm">&gt; 30 Days</p>
                    <p className="font-bold font-mono mt-1 text-red-600">$4,521</p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Invoices needing scheduling</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingPayables.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-3">
                      <p className="font-medium text-sm line-clamp-1">{item.supplier}</p>
                      <p className={`text-xs mt-0.5 ${item.status === 'Overdue' ? 'text-red-500 font-bold' : 'text-zinc-500'}`}>
                        {item.status}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold">${item.amount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-xs bg-zinc-100 hover:bg-zinc-200">
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl">
              <Button className="w-full"><CreditCard className="w-4 h-4 mr-2"/> Pay Multiple</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
