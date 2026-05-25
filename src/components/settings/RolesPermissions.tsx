import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Shield, Users, Check, Lock, Edit2, Trash2, X, Settings, ShoppingBag, Landmark } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

export function RolesPermissions() {
  const [rolesList, setRolesList] = useState([
    { id: '1', name: 'Super Admin', isSystem: true, users: 2, description: 'Full access to all settings, billing, and branches.' },
    { id: '2', name: 'Store Manager', isSystem: true, users: 5, description: 'Access to POS, inventory, reports, and team management for assigned branches.' },
    { id: '3', name: 'Cashier', isSystem: true, users: 15, description: 'Limited access to POS operations only.' },
    { id: '4', name: 'Warehouse Staff', isSystem: false, users: 4, description: 'Stock takes, transfers, and receiving goods.' }
  ]);

  // Dialog and Form States
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');

  // Permission settings toggles for editing/creating role
  const [permInventory, setPermInventory] = useState(true);
  const [permPurchases, setPermPurchases] = useState(true);
  const [permSales, setPermSales] = useState(true);
  const [permSettings, setPermSettings] = useState(false);

  const openCreateRoleDialog = () => {
    setSelectedRole(null);
    setRoleName('');
    setRoleDesc('');
    setPermInventory(true);
    setPermPurchases(true);
    setPermSales(true);
    setPermSettings(false);
    setIsRoleDialogOpen(true);
  };

  const openEditRoleDialog = (role: any) => {
    setSelectedRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description || '');
    // Simulated load of permissions
    setPermInventory(true);
    setPermPurchases(role.name !== 'Cashier');
    setPermSales(true);
    setPermSettings(role.name === 'Super Admin' || role.name === 'Store Manager');
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error("Role Name is required");
      return;
    }

    if (selectedRole) {
      // Edit Role
      setRolesList(rolesList.map(r => r.id === selectedRole.id ? { 
        ...r, 
        name: roleName, 
        description: roleDesc 
      } : r));
      toast.success(`Role permissions updated for "${roleName}"`);
    } else {
      // Create Role
      const newRole = {
        id: crypto.randomUUID(),
        name: roleName,
        isSystem: false,
        users: 0,
        description: roleDesc || 'Custom authorized role profile.'
      };
      setRolesList([...rolesList, newRole]);
      toast.success(`Custom Role "${roleName}" successfully deployed!`);
    }
    setIsRoleDialogOpen(false);
  };

  const handleDeleteRole = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete role profile "${name}"?`)) {
      return;
    }
    setRolesList(rolesList.filter(r => r.id !== id));
    toast.success(`Role profile "${name}" has been deleted.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Roles & Permissions</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Configure access control limits and Custom RBAC profiles.
          </p>
        </div>
        <Button onClick={openCreateRoleDialog} className="bg-primary text-primary-foreground shadow-sm">
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
                <TableHead className="text-right w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesList.map((role) => (
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
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] tracking-wider font-semibold">System</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 uppercase text-[10px] tracking-wider font-semibold">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-zinc-600 font-medium font-mono text-xs">
                      <Users className="w-4 h-4 text-zinc-400" /> {role.users}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      {role.isSystem && role.name === 'Super Admin' ? (
                        <Button variant="ghost" size="sm" disabled className="text-zinc-400 opacity-50">
                          <Lock className="w-3.5 h-3.5 mr-1" /> Locked
                        </Button>
                      ) : (
                        <>
                          <Button onClick={() => openEditRoleDialog(role)} variant="outline" size="sm" className="h-8 border-zinc-200 text-zinc-700 hover:bg-zinc-100">
                            <Edit2 className="w-3 h-3 mr-1.5" /> Edit Permissions
                          </Button>
                          {!role.isSystem && (
                            <Button onClick={() => handleDeleteRole(role.id, role.name)} variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* CREATE & EDIT CUSTOM ROLE DIALOG */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <DialogHeader>
            <DialogTitle>{selectedRole ? `Update Role: ${selectedRole.name}` : 'Create Custom RBAC Role Profile'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveRole} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Role Profile Name</label>
              <Input 
                value={roleName} 
                onChange={e => setRoleName(e.target.value)} 
                placeholder="e.g. Procurement Specialist, Sub-Manager" 
                disabled={selectedRole?.isSystem}
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">Short Description</label>
              <Input 
                value={roleDesc} 
                onChange={e => setRoleDesc(e.target.value)} 
                placeholder="Brief summary of duties and target branch locations" 
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Configure Access Permissions</p>
              
              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">Inventories & Stock Take Access</span>
                  <span className="text-[11px] text-zinc-400">View current stock levels globally</span>
                </div>
                <Switch checked={permInventory} onCheckedChange={setPermInventory} />
              </div>

              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">Purchases & Receiving Access</span>
                  <span className="text-[11px] text-zinc-400">Add, view, and process PO/GRNs</span>
                </div>
                <Switch checked={permPurchases} onCheckedChange={setPermPurchases} />
              </div>

              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">Sales Ledger & POS Screen</span>
                  <span className="text-[11px] text-zinc-400">Authorize checkout entries & customer invoicing</span>
                </div>
                <Switch checked={permSales} onCheckedChange={setPermSales} />
              </div>

              <div className="flex items-center justify-between pb-2 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">Administrative System Settings</span>
                  <span className="text-[11px] text-zinc-400">Modify tax configurations and business user branches</span>
                </div>
                <Switch checked={permSettings} onCheckedChange={setPermSettings} />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel/Close</Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Set Access Rights</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
