import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SupplierDashboard } from '../components/suppliers/SupplierDashboard';
import { SupplierDirectory } from '../components/suppliers/SupplierDirectory';
import { Procurement } from '../components/suppliers/Procurement';
import { SupplierPayables } from '../components/suppliers/SupplierPayables';
import { Button } from '../components/ui/button';
import { Download, Plus } from 'lucide-react';

export default function Suppliers() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Procurement & Suppliers</h2>
          <p className="text-zinc-500 mt-1">Manage suppliers, purchase orders, receiving, and payables.</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> New Purchase Order</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-100/80 p-1 rounded-xl w-full justify-start overflow-x-auto border border-zinc-200/50 hidden sm:inline-flex mb-6 h-12">
          <TabsTrigger value="dashboard" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="procurement" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Procurement (POs)</TabsTrigger>
          <TabsTrigger value="receiving" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Goods Receiving</TabsTrigger>
          <TabsTrigger value="payables" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Payables & Statements</TabsTrigger>
          <TabsTrigger value="directory" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Supplier Directory</TabsTrigger>
        </TabsList>
        
        {/* Mobile quick tabs */}
        <div className="sm:hidden grid grid-cols-2 gap-2 mb-6">
          <Button variant={activeTab === 'dashboard' ? 'default' : 'outline'} onClick={() => setActiveTab('dashboard')} className="w-full text-xs h-9">Dashboard</Button>
          <Button variant={activeTab === 'procurement' ? 'default' : 'outline'} onClick={() => setActiveTab('procurement')} className="w-full text-xs h-9">Purchases</Button>
          <Button variant={activeTab === 'receiving' ? 'default' : 'outline'} onClick={() => setActiveTab('receiving')} className="w-full text-xs h-9">Receiving</Button>
          <Button variant={activeTab === 'payables' ? 'default' : 'outline'} onClick={() => setActiveTab('payables')} className="w-full text-xs h-9">Payables</Button>
        </div>

        <div className="animate-in fade-in duration-500">
          <TabsContent value="dashboard" className="mt-0 outline-none">
            <SupplierDashboard />
          </TabsContent>
          
          <TabsContent value="procurement" className="mt-0 outline-none">
            <Procurement />
          </TabsContent>

          <TabsContent value="receiving" className="mt-0 outline-none">
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Goods Receiving Notes (GRN)</h3>
              <p className="text-zinc-500 max-w-md mx-auto">Receive stock against purchase orders. Track discrepancies, damaged items, and update inventory seamlessly.</p>
              <Button className="mt-6">Receive Goods (GRN)</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="payables" className="mt-0 outline-none">
            <SupplierPayables />
          </TabsContent>

          <TabsContent value="directory" className="mt-0 outline-none">
            <SupplierDirectory />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
