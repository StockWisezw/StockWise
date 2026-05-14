import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { InventoryDashboard } from '../components/inventory/InventoryDashboard';
import { ProductList } from '../components/inventory/ProductList';
import { BulkImport } from '../components/inventory/BulkImport';
import { Stocktake } from '../components/inventory/Stocktake';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Inventory Management</h2>
          <p className="text-zinc-500 mt-1">Manage catalog, bulk imports, stocktakes, and warehouses.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-100/80 p-1 rounded-xl w-full justify-start overflow-x-auto border border-zinc-200/50 hidden sm:inline-flex mb-6 h-12">
          <TabsTrigger value="dashboard" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Products</TabsTrigger>
          <TabsTrigger value="import" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Bulk Import</TabsTrigger>
          <TabsTrigger value="stocktake" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Stocktake</TabsTrigger>
          <TabsTrigger value="transfers" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">Transfers</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg px-6 h-10 data-[state=active]:shadow-sm">History</TabsTrigger>
        </TabsList>
        
        {/* Mobile quick tabs */}
        <div className="sm:hidden grid grid-cols-3 gap-2 mb-6">
          <Button variant={activeTab === 'dashboard' ? 'default' : 'outline'} onClick={() => setActiveTab('dashboard')} className="w-full text-xs h-9">Dashboard</Button>
          <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')} className="w-full text-xs h-9">Products</Button>
          <Button variant={activeTab === 'import' ? 'default' : 'outline'} onClick={() => setActiveTab('import')} className="w-full text-xs h-9">Import</Button>
        </div>

        <div className="animate-in fade-in duration-500">
          <TabsContent value="dashboard" className="mt-0 outline-none">
            <InventoryDashboard />
          </TabsContent>
          
          <TabsContent value="products" className="mt-0 outline-none">
            <ProductList />
          </TabsContent>
          
          <TabsContent value="import" className="mt-0 outline-none">
            <BulkImport />
          </TabsContent>

          <TabsContent value="stocktake" className="mt-0 outline-none">
            <Stocktake />
          </TabsContent>

          <TabsContent value="transfers" className="mt-0 outline-none">
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Branch Transfers</h3>
              <p className="text-zinc-500 max-w-md mx-auto">Move inventory between warehouses and store locations. Track in-transit stock.</p>
              <Button className="mt-6">Initiate Transfer</Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 outline-none">
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Audit Trails & History</h3>
              <p className="text-zinc-500 max-w-md mx-auto">View a comprehensive history of all stock movements, price changes, and adjustments.</p>
              <Button className="mt-6">View Movement History</Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
