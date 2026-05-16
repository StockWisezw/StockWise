import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Store, Warehouse, MapPin, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export function BranchWarehouseSettings() {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      toast.info('Location creation wizard will open here.');
    }, 400);
  };

  const locations = [
    { id: '1', name: 'Harare CBD (Main)', type: 'branch', address: '145 Jason Moyo Ave, Harare', tills: 3, status: 'active', isMain: true },
    { id: '2', name: 'Bulawayo Regional Hub', type: 'warehouse', address: '12 Robert Mugabe Way, Bulawayo', tills: 0, status: 'active', isMain: false },
    { id: '3', name: 'Mutare Retail', type: 'branch', address: '55 Main Street, Mutare', tills: 1, status: 'setup', isMain: false }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Branches & Warehouses</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your physical locations, POS tills, and warehouse storage.
          </p>
        </div>
        <Button onClick={handleAdd} disabled={isAdding} className="bg-primary text-primary-foreground shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200/60 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Store className="w-6 h-6" /></div>
            <Badge variant="outline" className="bg-white">Active</Badge>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-zinc-900">2</h4>
            <p className="text-sm font-medium text-zinc-500 mt-1">Retail Branches</p>
          </div>
        </Card>

        <Card className="border-zinc-200/60 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Warehouse className="w-6 h-6" /></div>
            <Badge variant="outline" className="bg-white">Active</Badge>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-zinc-900">1</h4>
            <p className="text-sm font-medium text-zinc-500 mt-1">Warehouses / Depots</p>
          </div>
        </Card>

        <Card className="border-zinc-200/60 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><LayoutGrid className="w-6 h-6" /></div>
            <Badge variant="outline" className="bg-white">Online</Badge>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-zinc-900">4</h4>
            <p className="text-sm font-medium text-zinc-500 mt-1">Connected POS Tills</p>
          </div>
        </Card>
      </div>

      <Card className="border-zinc-200/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Configured Locations</CardTitle>
              <CardDescription className="mt-1">Setup operational rules and inventory logic for each branch.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="w-[300px]">Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Physical Address</TableHead>
                <TableHead>Connected Tills</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border shadow-sm ${loc.type === 'branch' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                        {loc.type === 'branch' ? <Store className="w-4 h-4" /> : <Warehouse className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold text-zinc-900 group-hover:text-primary transition-colors flex items-center gap-2">
                          {loc.name}
                          {loc.isMain && <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20 text-[10px] py-0 px-1.5 h-4">HQ</Badge>}
                        </div>
                        <span className="text-xs text-zinc-500 font-medium capitalize mt-0.5">
                          {loc.status === 'active' ? 'Operational' : 'In Setup'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-medium text-zinc-700">{loc.type}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-zinc-600 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{loc.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-zinc-700 font-medium">
                      {loc.tills > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          {loc.tills} {loc.tills === 1 ? 'Till' : 'Tills'}
                        </div>
                      ) : (
                        <span className="text-zinc-400">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <MoreHorizontal className="w-4 h-4" />
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
