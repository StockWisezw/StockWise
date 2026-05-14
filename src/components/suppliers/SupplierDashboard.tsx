import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ShoppingCart, PackageOpen, TrendingDown, Clock, Building, Truck, BrainCircuit, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Button } from '../ui/button';

const purchaseTrend = [
  { name: 'Jan', amount: 15400 },
  { name: 'Feb', amount: 12200 },
  { name: 'Mar', amount: 18500 },
  { name: 'Apr', amount: 24000 },
  { name: 'May', amount: 19800 },
  { name: 'Jun', amount: 28500 },
];

export function SupplierDashboard() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">Total Purchases YTD</CardTitle>
            <ShoppingCart className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-zinc-900">$142,500</div>
            <p className="text-xs text-zinc-500 mt-1">Across 85 purchase orders</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Pending Payables</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-900">$45,210</div>
            <p className="text-xs text-amber-700 mt-1">
              $8,500 overdue
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Awaiting Receiving</CardTitle>
            <PackageOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">12 POs</div>
            <p className="text-xs text-blue-600 mt-1">
              Expected today: 3 deliveries
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Active Suppliers</CardTitle>
            <Building className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">48</div>
            <p className="text-xs text-emerald-600 mt-1">
              Top supplier: National Foods Ltd
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-sm border-zinc-200">
          <CardHeader>
            <CardTitle>Procurement Spend Trend</CardTitle>
            <CardDescription>Monthly purchasing volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={purchaseTrend}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#09090b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#09090b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val / 1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Purchases']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI & Insights */}
        <div className="space-y-6">
          <Card className="shadow-sm border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader className="pb-3 flex flex-row items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-indigo-900">Procurement AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm">
                <p className="text-sm text-zinc-700">
                  <strong className="text-indigo-900 font-semibold block mb-1">Restock Alert: Beverages</strong>
                  Your inventory for 2L juices is depleting faster than usual. Supplier "Delta Beverages" has a 5-day lead time. Generate a PO now to avoid out-of-stock.
                </p>
                <Button variant="link" className="px-0 h-auto text-indigo-600 text-xs mt-2">Generate Draft PO</Button>
              </div>
              <div className="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm">
                <p className="text-sm text-zinc-700">
                  <strong className="text-indigo-900 font-semibold block mb-1">Cost Fluctuation Alert</strong>
                  Cooking oil prices from "ZimOil Ltd" have increased by 14% over the last 30 days. Consider requesting quotes from alternative suppliers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Suppliers by Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "National Foods Ltd", value: "$45,200", pct: "32%" },
                  { name: "Delta Beverages", value: "$28,100", pct: "20%" },
                  { name: "ZimOil Traders", value: "$18,500", pct: "13%" },
                  { name: "ProBrands ZW", value: "$12,400", pct: "9%" },
                ].map((sup, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-600">
                        {sup.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-zinc-900 line-clamp-1">{sup.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">{sup.value}</p>
                      <p className="text-xs text-zinc-500">{sup.pct} of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
