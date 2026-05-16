import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Shield, Users, Check, Lock, Edit2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export function RolesPermissions() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      toast.info('Role creation modal would open here.');
    }, 400);
  };

  const roles = [
    { id: '1', name: 'Super Admin', isSystem: true, users: 2, description: 'Full access to all settings, billing, and branches.' },
    { id: '2', name: 'Store Manager', isSystem: true, users: 5, description: 'Access to POS, inventory, reports, and team management for assigned branches.' },
    { id: '3', name: 'Cashier', isSystem: true, users: 15, description: 'Limited access to POS operations only.' },
    { id: '4', name: 'Warehouse Staff', isSystem: false, users: 4, description: 'Stock takes, transfers, and receiving goods.' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Roles & Permissions</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Configure access control limits and Custom RBAC profiles.
          </p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="bg-primary text-primary-foreground shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-indigo-100/60 shadow-sm bg-indigo-50/30 p-6 flex items-start gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl shrink-0"><Shield className="w-6 h-6" /></div>
            <div>
              <h4 className="text-base font-bold text-indigo-900 leading-none mb-1.5">Strict Access Control</h4>
              <p className="text-sm text-indigo-700/80 leading-relaxed">
                By default, users only have access to the branches they are assigned to. System Admins can view all data globally.
              </p>
            </div>
         </Card>

         <Card className="border-emerald-100/60 shadow-sm bg-emerald-50/30 p-6 flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0"><Check className="w-6 h-6" /></div>
            <div>
              <h4 className="text-base font-bold text-emerald-900 leading-none mb-1.5">Compliant Design</h4>
              <p className="text-sm text-emerald-700/80 leading-relaxed">
                Changes to roles and permissions are logged to the audit trail to maintain enterprise compliance and security.
              </p>
            </div>
         </Card>
      </div>

      <Card className="border-zinc-200/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-lg">Configured Roles</CardTitle>
          <CardDescription>Default system roles and custom profiles available in your tenant.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="w-[200px]">Role Name</TableHead>
                <TableHead className="w-[300px]">Description</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Active Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-semibold text-zinc-900">
                    <div className="flex items-center gap-2">
                      {role.name === 'Super Admin' && <Shield className="w-4 h-4 text-purple-500" />}
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600 text-sm leading-relaxed">{role.description}</TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] tracking-wider">Default</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200 uppercase text-[10px] tracking-wider">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                      <Users className="w-4 h-4 text-zinc-400" /> {role.users}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {role.name === 'Super Admin' ? (
                      <Button variant="ghost" size="sm" disabled className="text-zinc-400 opacity-50">
                        <Lock className="w-3.5 h-3.5 mr-1" /> Locked
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="h-8 border-zinc-200 text-zinc-700 hover:bg-zinc-100">
                        <Edit2 className="w-3 h-3 mr-1.5" /> Edit Permissions
                      </Button>
                    )}
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
