import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Users, CreditCard, TrendingUp, Sparkles, Building2, UserPlus, Activity, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '../ui/button';

const growthData = [
  { name: 'Jan', new: 45, total: 145 },
  { name: 'Feb', new: 52, total: 197 },
  { name: 'Mar', new: 38, total: 235 },
  { name: 'Apr', new: 65, total: 300 },
  { name: 'May', new: 48, total: 348 },
  { name: 'Jun', new: 70, total: 418 },
];

const segmentData = [
  { name: 'Standard', value: 400 },
  { name: 'Silver', value: 300 },
  { name: 'Gold', value: 200 },
  { name: 'VIP', value: 100 },
];

export function CustomerDashboard() {
  return (
    <div className="space-y-6">
      {/* Top Value Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">418</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">Active Accounts (30d)</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900">284</div>
            <p className="text-xs text-zinc-500 mt-1">
              68% engagement rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Wholesale Partners</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">32</div>
            <p className="text-xs text-blue-600 mt-1">
              Generating 45% of total revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Outstanding Credit</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 font-mono">$12,450</div>
            <p className="text-xs text-red-600 mt-1 font-medium">
              $2,100 overdue &gt; 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-sm border-zinc-200">
          <CardHeader>
            <CardTitle>Customer Growth Strategy</CardTitle>
            <CardDescription>New vs Total customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="total" name="Total Customers" stroke="#18181b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="step" dataKey="new" name="New Customers" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI & Insights */}
        <div className="space-y-6">
          <Card className="shadow-sm border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-900">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Gemini CRM Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white border border-purple-100 rounded-xl shadow-sm">
                <p className="text-sm text-zinc-700">
                  <strong className="text-purple-900 font-semibold block mb-1">High Churn Risk Detected</strong>
                  3 wholesale customers haven't ordered in 45 days. Recommend sending a "We Miss You" 10% discount campaign immediately.
                </p>
                <Button variant="link" className="px-0 h-auto text-purple-600 text-xs mt-2">View At-Risk Accounts <ChevronRight className="w-3 h-3 ml-1"/></Button>
              </div>
              <div className="p-3 bg-white border border-purple-100 rounded-xl shadow-sm">
                <p className="text-sm text-zinc-700">
                  <strong className="text-purple-900 font-semibold block mb-1">Cross-Sell Opportunity</strong>
                  70% of customers buying "Mazoe" also buy "Bakers Marie". Consider bundling them for next week's promotion.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Wholesale Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Delta Distributors", value: "$45,200", trend: "+12%" },
                  { name: "Harare Supermarkets", value: "$32,100", trend: "+5%" },
                  { name: "Tuckshop Traders", value: "$18,500", trend: "-2%" },
                ].map((account, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-600">
                        {account.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-zinc-900">{account.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">{account.value}</p>
                      <p className={`text-xs ${account.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{account.trend}</p>
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
